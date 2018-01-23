/* eslint-env node */
import {createPlugin} from 'fusion-core';
import compose from 'koa-compose';
import koaHelmet from 'koa-helmet';

import {
  SecureHeadersServiceNameConfigToken,
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';
import buildCSPMiddleware from './csp/middleware.js';

import {REQUIRED_CSP_CONTENT_TYPES, CSP_HEADERS} from './constants.js';

export default createPlugin({
  deps: {
    serviceName: SecureHeadersServiceNameConfigToken,
    useFrameGuard: SecureHeadersUseFrameguardConfigToken,
    cspConfig: SecureHeadersCSPConfigToken,
  },
  middleware: ({serviceName, useFrameguard, cspConfig}) => async (
    ctx,
    next
  ) => {
    const secureHeaderMiddlewares = [];
    secureHeaderMiddlewares.push(
      buildCSPMiddleware({
        ctx,
        serviceName,
        cspConfig,
      })
    );
    if (useFrameguard !== false) {
      secureHeaderMiddlewares.push(
        koaHelmet.frameguard({action: 'sameorigin'})
      );
    }
    secureHeaderMiddlewares.push(koaHelmet.xssFilter());

    await compose(secureHeaderMiddlewares)(ctx, next);

    // TODO: move everything to post-render since it depends on content-type
    // If the content type does not require CSP headers then remove them
    if (!REQUIRED_CSP_CONTENT_TYPES.includes(ctx.type)) {
      CSP_HEADERS.forEach(h => ctx.remove(h));
    }
  },
});
