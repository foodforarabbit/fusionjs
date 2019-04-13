// @flow

import test from 'tape-cup';

import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import AuthHeadersPlugin from '../server';
import {AuthHeadersToken, AuthHeadersUUIDConfigToken} from '../tokens';

declare var __DEV__: boolean;

const memoizedMock = {
  has: () => false,
  set: () => null,
};

function createTestFixture() {
  const app = new App('content', el => el);
  app.register(AuthHeadersToken, AuthHeadersPlugin);
  return app;
}

test('exported as expected', t => {
  t.ok(AuthHeadersPlugin, 'plugin defined as expected');
  t.equal(typeof AuthHeadersPlugin, 'object', 'plugin is an object');
  t.end();
});

test('auth headers plugin resolved in test plugin', t => {
  t.plan(1);

  const app = createTestFixture();
  const testPlugin = createPlugin({
    deps: {authHeaders: AuthHeadersToken},
    provides: deps => {
      const {authHeaders} = deps;
      t.ok(authHeaders, 'plugin defined as expected');
    },
  });
  app.register(testPlugin);

  getSimulator(app);
  t.end();
});

test('missing auth param', t => {
  t.plan(1);

  // $FlowFixMe
  const mockContext = {
    request: {
      headers: {},
    },
    memoized: memoizedMock,
  };

  const app = createTestFixture();
  const testPlugin = createPlugin({
    deps: {authHeaders: AuthHeadersToken},
    provides: deps => {
      const {authHeaders} = deps;
      t.equal(
        authHeaders.from(mockContext).get('uuid'),
        '',
        'should return empty string if field is not present in headers'
      );
    },
  });
  app.register(testPlugin);

  getSimulator(app);
  t.end();
});

test('service - get authentication param from context', t => {
  t.plan(1);

  // $FlowFixMe
  const mockContext = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
    memoized: memoizedMock,
  };

  const app = createTestFixture();
  const testPlugin = createPlugin({
    deps: {authHeaders: AuthHeadersToken},
    provides: deps => {
      const {authHeaders} = deps;
      const service = authHeaders.from(mockContext);
      t.equal(
        service.get('uuid'),
        mockContext.request.headers['x-auth-params-uuid'],
        'correct value associated with uuid provided by service.'
      );
    },
  });
  app.register(testPlugin);

  getSimulator(app);
  t.end();
});

test('service - get authentication param from context (breeze)', t => {
  t.plan(2);

  // $FlowFixMe
  const mockContext = {
    request: {
      headers: {
        'x-uber-breeze-rtapi-token': 'some-auth-token',
        'x-auth-params-user-uuid': 'some-auth-uuid',
      },
    },
    memoized: memoizedMock,
  };

  const app = createTestFixture();
  const testPlugin = createPlugin({
    deps: {authHeaders: AuthHeadersToken},
    provides: deps => {
      const {authHeaders} = deps;
      const service = authHeaders.from(mockContext);
      t.equal(
        service.get('uuid'),
        mockContext.request.headers['x-auth-params-user-uuid'],
        'correct value associated with uuid provided by service.'
      );
      t.equal(
        service.get('token'),
        mockContext.request.headers['x-uber-breeze-rtapi-token'],
        'correct value associated with token provided by service.'
      );
    },
  });
  app.register(testPlugin);

  getSimulator(app);
  t.end();
});

test('get authentication param from override', t => {
  t.plan(1);

  // $FlowFixMe
  const mockContext = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
    memoized: memoizedMock,
  };
  const uuidOverride = 'some-other-auth-uuid';

  const app = createTestFixture();
  app.register(AuthHeadersUUIDConfigToken, uuidOverride);
  const testPlugin = createPlugin({
    deps: {authHeaders: AuthHeadersToken},
    provides: deps => {
      const {authHeaders} = deps;
      const service = authHeaders.from(mockContext);
      if (__DEV__) {
        /* Check development environment */
        t.equal(
          service.get('uuid'),
          uuidOverride,
          'correctly applies override value associated with uuid provided by service'
        );
      } else {
        /* Check production environment */
        t.equal(
          service.get('uuid'),
          mockContext.request.headers['x-auth-params-uuid'],
          'correctly ignores override value associated with uuid provided by service (in production)'
        );
      }
    },
  });
  app.register(testPlugin);

  getSimulator(app);
  t.end();
});
