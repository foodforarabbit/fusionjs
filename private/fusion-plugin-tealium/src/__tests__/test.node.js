// @flow
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

  const mockCtx: any = {
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
  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: mockConfig,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      t.pass('next() called');
      t.end();
    });
  }
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

  const mockCtx: any = {
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
  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: configStub,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      t.pass('next() called');
      t.end();
    });
  }
});

test('plugin skips processing non-HTML request', t => {
  const configStub = () => {
    t.fail('config initializer should not be called');
    return {};
  };

  const mockCtx: any = {
    nonce: 'xyz456',
    template: {
      head: {
        push: noop,
      },
    },
  };

  t.plan(1);
  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: configStub,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      t.pass('next() called');
      t.end();
    });
  }
});

test('plugin skips requests that dont have a full config', t => {
  const configStub = () => {
    return {
      name: 'partial_config',
    };
  };

  const mockCtx: any = {
    nonce: 'xyz456',
    template: {
      head: {
        push: () => {
          t.fail('push should not be called');
        },
      },
    },
  };

  t.plan(1);
  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: configStub,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      t.pass('next() called');
      t.end();
    });
  }
});
