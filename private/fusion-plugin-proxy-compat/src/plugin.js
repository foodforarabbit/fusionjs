// @flow
/* eslint-env node */
const pathToRegexp = require('path-to-regexp');
const request = require('request');

const {GalileoToken} = require('@uber/fusion-plugin-galileo');
const {LoggerToken} = require('fusion-tokens');
const {TracerToken} = require('@uber/fusion-plugin-tracer');
const {M3Token} = require('@uber/fusion-plugin-m3');
const registerM3Events = require('@uber/request-m3-events');
const {createPlugin} = require('fusion-core');
/*::
import type {Context} from 'fusion-core';
import type {ProxyCompatPluginType, TransformedProxyConfigType} from './types';
*/

const path = require('path');
const url = require('url');

const {ProxyConfigToken} = require('./tokens');

const appName = process.env.SVC_ID || 'unknown-service';

const plugin /*: ProxyCompatPluginType */ = createPlugin({
  deps: {
    config: ProxyConfigToken,
    logger: LoggerToken,
    m3Client: M3Token,
    Tracer: TracerToken.optional,
    Galileo: GalileoToken.optional,
  },

  middleware: ({config, logger, m3Client, Tracer, Galileo}) => {
    const matchFn = getMatchFn(config);
    return async (
      ctx /*: Context */,
      next /*: () => Promise<void> */
    ) /*: Promise<void> */ => {
      await next();
      if (ctx.element || ctx.body) return;
      const match = matchFn(ctx);
      if (!match) return;
      const {proxyConfig} = match;
      ctx.req.m3Tags = {
        route: proxyConfig.m3Key || 'unknown_route',
        ...(ctx.req.m3Tags || {}),
      };
      const proxyHeaders = getProxyHeaders(ctx, proxyConfig);

      if (Tracer && Galileo) {
        const {galileo} = Galileo;
        const {span} = Tracer.from(ctx);
        await new Promise((
          resolve /*: (result: Promise<void> | void) => void */
        ) /*: void */ => {
          galileo.AuthenticateOut(
            proxyConfig.name,
            'http',
            span,
            function onHeaders(err, headers) /*: void */ {
              if (err) {
                logger.error(
                  err.message || 'Failed to get galileo auth ( outbound )',
                  {path: ctx.path}
                );
              }
              if (headers) {
                Object.assign(proxyHeaders, headers);
              }
              resolve();
            }
          );
        });
      }
      const proxyReq = request(getProxyUrl(proxyConfig, ctx), {
        followRedirect: false,
        headers: proxyHeaders,
      });
      proxyReq.on('request', (req) /*: void */ => {
        registerM3Events(req, {
          client: m3Client,
          key: proxyConfig.m3Key || 'unknown_route',
        });
      });

      ctx.body = ctx.req.pipe(proxyReq);
    };
  },
});

module.exports = plugin;

function getProxyUrl(proxyConfig, ctx /*: Context */) /*: string */ {
  const resultingUrl = url.resolve(
    proxyConfig.uri,
    ctx.url.replace('/' + proxyConfig.name, '')
  );
  return resultingUrl;
}

function getProxyHeaders(ctx /*: Context */, proxyConfig = {}) {
  var headers = Object.assign(
    ctx.headers,
    {
      'x-uber-source': appName,
      'x-uber-app': appName,
      ...(proxyConfig.uri ? {host: url.parse(proxyConfig.uri).host} : {}),
    },
    proxyConfig.headers || {}
  );

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
    headers['content-length'] = '0';
  }

  delete headers['x-csrf-token'];

  return headers;
}

function getMatchFn(
  config
) /*: (
  ctx: Context
) => {|proxyConfig: TransformedProxyConfigType, regex: any|} | void */ {
  let matchers = [];
  Object.keys(config).forEach((key) /*: void */ => {
    const proxyConfig /*: TransformedProxyConfigType */ = {
      ...config[key],
      name: key,
      m3Key: 'unknown',
    };
    const routes = proxyConfig.routes;
    routes.forEach(({route, headers = {}, m3Key}) /*: void */ => {
      matchers.push({
        regex: pathToRegexp(path.join('/', key, route)),
        proxyConfig: {
          ...proxyConfig,
          headers: {...proxyConfig.headers, ...headers},
          m3Key,
        },
      });
    });
  });
  return ctx => {
    const match = matchers.find(({regex}) /*: any */ => {
      const tested = regex.test(ctx.path);
      return tested;
    });
    return match;
  };
}

// $FlowFixMe
module.exports.getMatchFn = getMatchFn;

// $FlowFixMe
module.exports.getProxyHeaders = getProxyHeaders;
