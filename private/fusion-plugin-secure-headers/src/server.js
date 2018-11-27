// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import compose from 'koa-compose';
import koaHelmet from 'koa-helmet';

import {
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';
import buildCSPMiddleware from './csp/middleware.js';

import {REQUIRED_CSP_CONTENT_TYPES, CSP_HEADERS} from './constants.js';

export default __NODE__ &&
  createPlugin({
    deps: {
      useFrameGuard: SecureHeadersUseFrameguardConfigToken.optional,
      cspConfig: SecureHeadersCSPConfigToken.optional,
    },
    middleware: ({useFrameGuard = true, cspConfig}) => {
      const serviceName = process.env.SVC_ID;
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
          secureHeaderMiddlewares.push(
            koaHelmet.frameguard({action: 'sameorigin'})
          );
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
