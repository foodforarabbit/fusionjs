// @flow
/* eslint-env node */
import {createPlugin, memoize, type FusionPlugin} from 'fusion-core';
import compose from 'koa-compose';
import koaHelmet from 'koa-helmet';
import merge from 'deepmerge';

import {
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';
import {CSPOverrideConfig} from './types.js';

import buildCSPMiddleware from './csp/middleware.js';

import {REQUIRED_CSP_CONTENT_TYPES, CSP_HEADERS} from './constants.js';

import type {SecureHeadersDepsType, SecureHeadersServiceType} from './types.js';

type PluginType = FusionPlugin<SecureHeadersDepsType, SecureHeadersServiceType>;

const pluginFactory: () => PluginType = () =>
  createPlugin({
    deps: {
      useFrameGuard: SecureHeadersUseFrameguardConfigToken.optional,
      cspConfig: SecureHeadersCSPConfigToken.optional,
    },
    provides: deps => {
      return {
        from: memoize(ctx => new CSPOverrideConfig()),
      };
    },
    middleware: ({useFrameGuard = true, cspConfig = {}}, service) => {
      const serviceName = process.env.SVC_ID || '';
      return async (ctx, next) => {
        const secureHeaderMiddlewares = [];

        await next();

        if (typeof cspConfig === 'function') {
          cspConfig = await cspConfig(ctx);
        }

        let csp = Object.assign({}, cspConfig);
        if (!csp.overrides) csp.overrides = {};

        let cspOverrideConfig: CSPOverrideConfig = service.from(ctx);
        let cspOverrides = merge(csp.overrides, cspOverrideConfig.overrides);
        csp.overrides = cspOverrides;

        secureHeaderMiddlewares.push(
          buildCSPMiddleware({
            ctx,
            serviceName,
            csp,
          })
        );

        if (useFrameGuard !== false) {
          // Default to sameorigin
          let frameguard = koaHelmet.frameguard({
            action: 'sameorigin',
          });

          if (cspOverrideConfig.frameGuardAllowFromDomain != null) {
            let allowedDomain = cspOverrideConfig.frameGuardAllowFromDomain;
            frameguard = koaHelmet.frameguard({
              action: 'allow-from',
              domain: allowedDomain,
            });
          }

          secureHeaderMiddlewares.push(frameguard);
        }

        secureHeaderMiddlewares.push(koaHelmet.xssFilter());

        await compose(secureHeaderMiddlewares)(ctx);

        // If the content type does not require CSP headers then remove them
        if (!REQUIRED_CSP_CONTENT_TYPES.includes(ctx.type)) {
          CSP_HEADERS.forEach(h => ctx.remove(h));
        }
      };
    },
  });

export default ((__NODE__ && pluginFactory(): any): PluginType);
