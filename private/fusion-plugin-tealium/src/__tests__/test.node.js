/* eslint-env node */
import test from 'tape-cup';
import {consumeSanitizedHTML} from 'fusion-core';

import TealiumPlugin from '../server';

function noop() {}

test('plugin - exported as expected', t => {
  t.ok(TealiumPlugin, 'plugin defined as expected');
  t.equal(typeof TealiumPlugin, 'object', 'plugin is an object');
  t.end();
});

test('plugin - server init', t => {
  const mockConfig = {
    account: 'foo',
    profile: 'main',
    env: 'prod',
    geo: 'NL',
  };

  const mockCtx = {
    element: {},
    nonce: 'abc123',
    template: {
      head: {
        push: h => {
          t.equal(
            consumeSanitizedHTML(h),
            "<script async nonce='abc123' src='https://tags.tiqcdn.com/utag/foo/strict/prod/utag.js'></script>",
            'constructs and sanitizes script tag correctly'
          );
          t.pass('script tag pushed');
        },
      },
    },
  };

  t.plan(3);
  TealiumPlugin.middleware({config: mockConfig})(mockCtx, () => {
    t.pass('next() called');
    t.end();
  });
});

test('plugin accepts config as a function', t => {
  const configStub = ctx => {
    t.equal(ctx.nonce, 'cakeface', 'context was passed to config initializer');

    return Promise.resolve({
      account: 'foo',
      profile: 'main',
      env: 'prod',
      geo: 'IN',
    });
  };

  const mockCtx = {
    element: {},
    nonce: 'cakeface',
    template: {
      head: {
        push: h => {
          t.equal(
            consumeSanitizedHTML(h),
            "<script async nonce='cakeface' src='https://tags.tiqcdn.com/utag/foo/main/prod/utag.js'></script>",
            'constructs and sanitizes script tag correctly'
          );
          t.pass('script tag pushed');
        },
      },
    },
  };

  t.plan(4);
  TealiumPlugin.middleware({config: configStub})(mockCtx, () => {
    t.pass('next() called');
    t.end();
  });
});

test('plugin skips processing non-HTML request', t => {
  const configStub = () => {
    t.fail('config initializer should not be called');
    return {};
  };

  const mockCtx = {
    nonce: 'xyz456',
    template: {
      head: {
        push: noop,
      },
    },
  };

  t.plan(1);
  TealiumPlugin.middleware({config: configStub})(mockCtx, () => {
    t.pass('next() called');
    t.end();
  });
});
