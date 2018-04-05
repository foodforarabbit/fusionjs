/* eslint-env node */
import {LoggerToken} from 'fusion-tokens';
import {createPlugin, createToken} from 'fusion-core';
import pathToRegexp from 'path-to-regexp';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import request from 'request';
import url from 'url';
import path from 'path';

export const ProxyConfigToken = createToken('ProxyConfig');
const appName = process.env.SVC_ID || 'unknown-service';

export default __NODE__ &&
  createPlugin({
    deps: {
      config: ProxyConfigToken,
      logger: LoggerToken,
      Tracer: TracerToken,
      Galileo: GalileoToken,
    },
    middleware: ({config, logger, Tracer, Galileo}) => {
      const {galileo} = Galileo;
      const matchFn = getMatchFn(config);
      return async (ctx, next) => {
        await next();
        if (ctx.element || ctx.body) return;
        const match = matchFn(ctx);
        if (!match) return;
        const {proxyConfig} = match;
        const {span} = Tracer.from(ctx);
        const proxyHeaders = getProxyHeaders(ctx);
        await new Promise(resolve => {
          galileo.AuthenticateOut(
            proxyConfig.name,
            'http',
            span,
            function onHeaders(err, headers) {
              if (err) {
                logger.error(
                  err.message || 'Failed to get galileo auth ( outbound )',
                  {
                    path: ctx.path,
                  }
                );
              }
              if (headers) {
                Object.assign(proxyHeaders, headers);
              }
              resolve();
            }
          );
        });
        ctx.body = ctx.req.pipe(
          request(getProxyUrl(proxyConfig, ctx), {headers: proxyHeaders})
        );
      };
    },
  });

function getProxyUrl(proxyConfig, ctx) {
  const resultingUrl = url.resolve(
    proxyConfig.uri,
    ctx.url.replace('/' + proxyConfig.name, '')
  );
  return resultingUrl;
}

export function getProxyHeaders(ctx) {
  var headers = Object.assign(ctx.headers, {
    'x-uber-source': appName,
    'x-uber-app': appName,
  });

  // x-uber-origin is a comma separated list of all the apps/clients
  // that a request has passed through. The most recent service is
  // appended.
  var xUberOriginHeader = [appName];

  if (headers['x-uber-origin']) {
    xUberOriginHeader.unshift(headers['x-uber-origin'].replace('_', '-'));
  }

  headers['x-uber-origin'] = xUberOriginHeader.join(',');

  // Varnish doesn't like chunked encoding.
  // Let's always send a body for non-get requests
  if (ctx.method !== 'GET' && !headers['content-length']) {
    headers['content-length'] = 0;
  }

  delete headers['x-csrf-token'];

  return headers;
}

export function getMatchFn(config) {
  let matchers = [];
  Object.keys(config).forEach(key => {
    const proxyConfig = config[key];
    proxyConfig.name = key;
    const routes = proxyConfig.routes;
    routes.forEach(({route /*, m3Key*/}) => {
      // TODO: handle m3Key
      matchers.push({
        regex: pathToRegexp(path.join('/', key, route)),
        proxyConfig,
      });
    });
  });
  return ctx => {
    const match = matchers.find(({regex}) => {
      const tested = regex.test(ctx.path);
      return tested;
    });
    return match;
  };
}
