// @flow

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

test('exported as expected', () => {
  expect(AuthHeadersPlugin).toBeTruthy();
  expect(typeof AuthHeadersPlugin).toBe('object');
});

test('auth headers plugin resolved in test plugin', () => {
  expect.assertions(1);

  const app = createTestFixture();
  const testPlugin = createPlugin({
    deps: {authHeaders: AuthHeadersToken},
    provides: deps => {
      const {authHeaders} = deps;
      expect(authHeaders).toBeTruthy();
    },
  });
  app.register(testPlugin);

  getSimulator(app);
});

test('missing auth param', () => {
  expect.assertions(1);

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
      expect(authHeaders.from(mockContext).get('uuid')).toBe('');
    },
  });
  app.register(testPlugin);

  getSimulator(app);
});

test('service - get authentication param from context', () => {
  expect.assertions(1);

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
      expect(service.get('uuid')).toBe(
        mockContext.request.headers['x-auth-params-uuid']
      );
    },
  });
  app.register(testPlugin);

  getSimulator(app);
});

test('service - get authentication param from context (breeze)', () => {
  expect.assertions(2);

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
      expect(service.get('uuid')).toBe(
        mockContext.request.headers['x-auth-params-user-uuid']
      );
      expect(service.get('token')).toBe(
        mockContext.request.headers['x-uber-breeze-rtapi-token']
      );
    },
  });
  app.register(testPlugin);

  getSimulator(app);
});

test('get authentication param from override', () => {
  expect.assertions(1);

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
        expect(service.get('uuid')).toBe(uuidOverride);
      } else {
        /* Check production environment */
        expect(service.get('uuid')).toBe(
          mockContext.request.headers['x-auth-params-uuid']
        );
      }
    },
  });
  app.register(testPlugin);

  getSimulator(app);
});
