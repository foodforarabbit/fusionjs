// @flow
/* eslint-env node */
import {createPlugin, type FusionPlugin} from 'fusion-core';
import compose from 'koa-compose';
import koaHelmet from 'koa-helmet';

import {
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersFrameguardAllowFromDomainConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';

import buildCSPMiddleware from './csp/middleware.js';

import {REQUIRED_CSP_CONTENT_TYPES, CSP_HEADERS} from './constants.js';

import type {SecureHeadersDepsType} from './types.js';

type PluginType = FusionPlugin<SecureHeadersDepsType, void>;

const pluginFactory: () => PluginType = () =>
  createPlugin({
    deps: {
      useFrameGuard: SecureHeadersUseFrameguardConfigToken.optional,
      frameGuardAllowFromDomain:
        SecureHeadersFrameguardAllowFromDomainConfigToken.optional,
      cspConfig: SecureHeadersCSPConfigToken.optional,
    },
    middleware: ({
      useFrameGuard = true,
      frameGuardAllowFromDomain = null,
      cspConfig = {},
    }) => {
      const serviceName = process.env.SVC_ID || '';
      return async (ctx, next) => {
        const secureHeaderMiddlewares = [];
        if (typeof cspConfig === 'function') {
          cspConfig = await cspConfig(ctx);
        }
        secureHeaderMiddlewares.push(
          buildCSPMiddleware({
            ctx,
            serviceName,
            cspConfig,
          })
        );

        if (useFrameGuard !== false) {
          // Default to sameorigin
          let frameguard = koaHelmet.frameguard({
            action: 'sameorigin',
          });

          if (frameGuardAllowFromDomain != null) {
            let allowedDomain = await frameGuardAllowFromDomain(ctx);
            if (allowedDomain != null) {
              frameguard = koaHelmet.frameguard({
                action: 'allow-from',
                domain: allowedDomain,
              });
            }
          }

          secureHeaderMiddlewares.push(frameguard);
        }

        secureHeaderMiddlewares.push(koaHelmet.xssFilter());

        await compose(secureHeaderMiddlewares)(ctx, next);

        // If the content type does not require CSP headers then remove them
        if (!REQUIRED_CSP_CONTENT_TYPES.includes(ctx.type)) {
          CSP_HEADERS.forEach(h => ctx.remove(h));
        }
      };
    },
  });

export default ((__NODE__ && pluginFactory(): any): PluginType);
