// @flow
/* eslint-env node */
import {createPlugin, dangerouslySetHTML, html} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import request from 'request';
import requestPromise from 'request-promise';
import url from 'url';
import {MagellanUriToken, JarvisUriToken} from './tokens';
import type {PluginType} from './types';

const defaultMagellanUri = 'http://localhost:14711';
const defaultJarvisUri = 'http://localhost:15008';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      magellanUri: MagellanUriToken.optional,
      jarvisUri: JarvisUriToken.optional,
    },
    middleware({
      magellanUri = defaultMagellanUri,
      jarvisUri = defaultJarvisUri,
      logger,
    }) {
      let prefix = process.env.ROUTE_PREFIX || '';
      if (prefix !== '' && prefix[0] !== '/') {
        prefix = '/' + prefix;
      }
      var fragments = [
        magellanUri,
        magellanUri + '/css?noFonts=true&noIcons=true&routePrefix=' + prefix,
        magellanUri + '/scripts?routePrefix=' + prefix,
        jarvisUri + '/jarvis-standalone/assets',
      ];
      return async (ctx, next) => {
        if (ctx.url.startsWith('/magellan')) {
          const proxyUrl = ctx.url.replace('/magellan', '');
          ctx.body = ctx.req.pipe(request(url.resolve(magellanUri, proxyUrl)));
          return next();
        } else if (ctx.url.startsWith('/jarvis-standalone')) {
          const proxyUrl = ctx.url;
          ctx.body = ctx.req.pipe(request(url.resolve(jarvisUri, proxyUrl)));
          return next();
        }
        if (!ctx.element || 'skipMagellan' in ctx.query) {
          return next();
        }
        try {
          const results = await Promise.all(
            fragments.map(fragmentUri => {
              return requestPromise(fragmentUri);
            })
          );
          const markup = results[0];
          let css = [];
          const scripts = results[2];
          const cssReg = /href="(.*?)"/g;
          const noncedScripts = scripts
            ? scripts.replace('<script>', '<script nonce="' + ctx.nonce + '">')
            : scripts;
          let match;
          while ((match = cssReg.exec(results[1]))) {
            css.push(match[1]);
          }
          const jarvisResults = getJarvisState(results[3], logger);
          if (jarvisResults.stylesheets) {
            css = css.concat(jarvisResults.stylesheets);
          }
          ctx.template.body.push(dangerouslySetHTML(markup));
          css.forEach(link => {
            ctx.template.head.push(
              dangerouslySetHTML(`<link rel='stylesheet' href='${link}' />`)
            );
          });
          ctx.template.body.push(dangerouslySetHTML(noncedScripts));
          ctx.template.body.push(
            html`
              <div id="jarvis-content"></div>
            `
          );
          if (jarvisResults.scripts) {
            jarvisResults.scripts.forEach(src => {
              ctx.template.body.push(
                dangerouslySetHTML(
                  `<script nonce='${ctx.nonce}' src='${src}'></script>`
                )
              );
            });
          }
        } catch (e) {
          logger.error('Failed to load Magellan/Jarvis assets', e);
        }
        return next();
      };
    },
  });

function getJarvisState(rawJarvisResponse, logger) {
  try {
    return JSON.parse(rawJarvisResponse);
  } catch (error) {
    var errorMessage =
      'Error parsing jarvis assets response: ' + rawJarvisResponse;
    logger.error(errorMessage, {
      error: error,
    });
    return {
      error: errorMessage,
    };
  }
}

export default ((plugin: any): PluginType);
