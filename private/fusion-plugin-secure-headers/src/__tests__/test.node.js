// @flow
import test from 'tape-cup';

import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import SecureHeadersPlugin from '../server';
import {
  SecureHeadersToken,
  SecureHeadersCSPConfigToken,
  SecureHeadersUseFrameguardConfigToken,
} from '../tokens';

const fixtureHeaders = {
  'Content-Type': 'text/html',
};

const fixtureCSP = nonce =>
  `block-all-mixed-content; frame-src 'self'; worker-src 'self'; child-src 'self'; connect-src 'self'; manifest-src 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://d1a3f4spazzrp4.cloudfront.net https://d3i4yxtzktqr9n.cloudfront.net https://tb-static.uber.com https://tbs-static.uber.com 'nonce-${nonce}' https://www.google-analytics.com https://ssl.google-analytics.com maps.googleapis.com maps.google.com; style-src 'self' 'unsafe-inline' https://d1a3f4spazzrp4.cloudfront.net https://d3i4yxtzktqr9n.cloudfront.net https://tb-static.uber.com https://tbs-static.uber.com; report-uri https://csp.uber.com/csp?a=unknown&ro=false`;

const fixtureCSPWithOverrides = nonce =>
  `block-all-mixed-content; frame-src 'self'; worker-src 'self'; child-src 'self'; connect-src 'self' test.uber.com; manifest-src 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://d1a3f4spazzrp4.cloudfront.net https://d3i4yxtzktqr9n.cloudfront.net https://tb-static.uber.com https://tbs-static.uber.com 'nonce-${nonce}' https://www.google-analytics.com https://ssl.google-analytics.com maps.googleapis.com maps.google.com; style-src 'self' 'unsafe-inline' https://d1a3f4spazzrp4.cloudfront.net https://d3i4yxtzktqr9n.cloudfront.net https://tb-static.uber.com https://tbs-static.uber.com; report-uri https://csp.uber.com/csp?a=unknown&ro=false`;

const fixtureCSPWithExtendedOverrides = nonce =>
  `block-all-mixed-content; frame-src 'self'; worker-src 'self'; child-src 'self'; connect-src 'self' test.uber.com test-2.uber.com; manifest-src 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://d1a3f4spazzrp4.cloudfront.net https://d3i4yxtzktqr9n.cloudfront.net https://tb-static.uber.com https://tbs-static.uber.com 'nonce-${nonce}' https://www.google-analytics.com https://ssl.google-analytics.com maps.googleapis.com maps.google.com; style-src 'self' 'unsafe-inline' https://d1a3f4spazzrp4.cloudfront.net https://d3i4yxtzktqr9n.cloudfront.net https://tb-static.uber.com https://tbs-static.uber.com; report-uri https://csp.uber.com/csp?a=unknown&ro=false`;

function createTestFixture() {
  const app = new App('content', el => el);
  app.register(SecureHeadersToken, SecureHeadersPlugin);
  return app;
}

test('Exported as expected', t => {
  t.ok(SecureHeadersPlugin, 'plugin defined as expected');
  t.equal(typeof SecureHeadersPlugin, 'object', 'plugin is an object');
  t.end();
});

test('basics - default CSP headers', async t => {
  const app = createTestFixture();

  t.plan(3);
  const simulator = getSimulator(app);
  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(
    ctx.response.header['content-security-policy'],
    fixtureCSP(ctx.nonce)
  );
  t.equal(ctx.response.header['x-frame-options'], 'SAMEORIGIN');
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});

test('basics - csp override', async t => {
  const app = createTestFixture();
  // $FlowFixMe
  app.register(SecureHeadersCSPConfigToken, {
    overrides: {
      connectSrc: ['test.uber.com'],
    },
  });
  t.plan(3);
  const simulator = getSimulator(app);
  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(
    ctx.response.header['content-security-policy'],
    fixtureCSPWithOverrides(ctx.nonce)
  );
  t.equal(ctx.response.header['x-frame-options'], 'SAMEORIGIN');
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});

test('basics - csp override with a function', async t => {
  const app = createTestFixture();
  const overrideFunc = function() {
    return {
      overrides: {
        connectSrc: ['test.uber.com'],
      },
    };
  };
  // $FlowFixMe
  app.register(SecureHeadersCSPConfigToken, overrideFunc);
  t.plan(3);
  const simulator = getSimulator(app);
  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(
    ctx.response.header['content-security-policy'],
    fixtureCSPWithOverrides(ctx.nonce)
  );
  t.equal(ctx.response.header['x-frame-options'], 'SAMEORIGIN');
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});

test('basics - csp override with a function and a service call', async t => {
  t.plan(3);

  const app = createTestFixture();

  const overrideFunc = function() {
    return {
      overrides: {
        connectSrc: ['test.uber.com'],
      },
    };
  };
  // $FlowFixMe
  app.register(SecureHeadersCSPConfigToken, overrideFunc);

  const simulator = getSimulator(
    app,
    createPlugin({
      deps: {secureHeaders: SecureHeadersToken},
      middleware: ({secureHeaders}) => {
        return async (ctx, next) => {
          let cspConfig = secureHeaders.from(ctx);
          cspConfig.overrides = {connectSrc: ['test-2.uber.com']};
          return next();
        };
      },
    })
  );

  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(
    ctx.response.header['content-security-policy'],
    fixtureCSPWithExtendedOverrides(ctx.nonce)
  );
  t.equal(ctx.response.header['x-frame-options'], 'SAMEORIGIN');
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});

test('basics - disabling frameguard does not add x-frame-origin header', async t => {
  const app = createTestFixture();
  app.register(SecureHeadersUseFrameguardConfigToken, false);

  t.plan(3);
  const simulator = getSimulator(app);
  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(
    ctx.response.header['content-security-policy'],
    fixtureCSP(ctx.nonce)
  );
  t.equal(ctx.response.header['x-frame-options'], undefined);
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});

test('basics - frameGuardAllowFromDomain override', async t => {
  t.plan(2);

  const app = createTestFixture();
  const simulator = getSimulator(
    app,
    createPlugin({
      deps: {secureHeaders: SecureHeadersToken},
      middleware: ({secureHeaders}) => {
        return async (ctx, next) => {
          let cspConfig = secureHeaders.from(ctx);
          cspConfig.frameGuardAllowFromDomain = 'http://localhost:3000';
          return next();
        };
      },
    })
  );

  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(
    ctx.response.header['x-frame-options'],
    'ALLOW-FROM http://localhost:3000'
  );
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});

test('basics - frameGuardAllowFromDomain override non-matching domain', async t => {
  t.plan(2);

  const app = createTestFixture();
  const simulator = getSimulator(
    app,
    createPlugin({
      deps: {secureHeaders: SecureHeadersToken},
      middleware: ({secureHeaders}) => {
        return async (ctx, next) => {
          let cspConfig = secureHeaders.from(ctx);
          cspConfig.frameGuardAllowFromDomain = null;
          return next();
        };
      },
    })
  );

  const ctx = await simulator.render('/test-url', fixtureHeaders);
  t.equal(ctx.response.header['x-frame-options'], 'SAMEORIGIN');
  t.equal(ctx.response.header['x-xss-protection'], '1; mode=block');
  t.end();
});
