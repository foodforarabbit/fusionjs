/* eslint-env node */
import buildCSPMiddleware from './csp/middleware';
import compose from 'koa-compose';
import koaHelmet from 'koa-helmet';

// TODO: initiate cspFlipr implicitly instead of an explict dependency
export default ({config, cspFlipr}) => async (ctx, next) => {
  const secureHeaderMiddlewares = [];
  secureHeaderMiddlewares.push(
    buildCSPMiddleware({
      ctx,
      config,
      // TODO: affirm Flipr plugin interface
      cspFlipr: (cspFlipr && cspFlipr.of().getClient()) || null,
    })
  );
  if (config.useFrameguard !== false) {
    secureHeaderMiddlewares.push(koaHelmet.frameguard({action: 'sameorigin'}));
  }
  secureHeaderMiddlewares.push(koaHelmet.xssFilter());

  await compose(secureHeaderMiddlewares)(ctx, next);

  // TODO: move everything to post-render since it depends on content-type
  // If the content type does not require CSP headers then remove them
  const RequiredCSPContentTypes = ['text/html', 'image/svg'];
  const CSPHeaders = [
    'Content-Security-Policy',
    'Content-Security-Policy-Report-Only',
    'X-Content-Security-Policy',
    'X-Content-Security-Policy-Report-Only',
    'X-WebKit-CSP',
    'X-WebKit-CSP-Report-Only',
  ];
  if (!RequiredCSPContentTypes.includes(ctx.type)) {
    CSPHeaders.forEach(h => ctx.remove(h));
  }
};
