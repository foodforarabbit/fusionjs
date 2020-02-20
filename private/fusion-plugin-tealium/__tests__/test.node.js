// @flow
/* eslint-env node */
import {consumeSanitizedHTML} from 'fusion-core';
import TealiumPlugin from '../src/server';

function noop() {}

test('plugin - exported as expected', () => {
  expect(TealiumPlugin).toBeTruthy();
  expect(typeof TealiumPlugin).toBe('object');
});

test('plugin - server init', done => {
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
          expect(consumeSanitizedHTML(h)).toBe(
            "<script async nonce='abc123' src='https://tags.tiqcdn.com/utag/foo/strict/prod/utag.js'></script>"
          );
        },
      },
    },
  };

  expect.assertions(1);
  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: mockConfig,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      done();
    });
  }
});

test('plugin accepts config as a function', done => {
  const configStub = ctx => {
    expect(ctx.nonce).toBe('cakeface');

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
          expect(consumeSanitizedHTML(h)).toBe(
            "<script async nonce='cakeface' src='https://tags.tiqcdn.com/utag/foo/main/prod/utag.js'></script>"
          );
        },
      },
    },
  };

  expect.assertions(2);
  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: configStub,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      done();
    });
  }
});

test('plugin skips processing non-HTML request', done => {
  const configStub = () => {
    // $FlowFixMe
    done.fail('config initializer should not be called');
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

  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: configStub,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      done();
    });
  }
});

test('plugin skips requests that dont have a full config', done => {
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
          // $FlowFixMe
          done.fail('push should not be called');
        },
      },
    },
  };

  if (TealiumPlugin.middleware) {
    TealiumPlugin.middleware(
      {
        config: configStub,
        logger: (null: any),
      },
      (null: any)
    )(mockCtx, async () => {
      done();
    });
  }
});
