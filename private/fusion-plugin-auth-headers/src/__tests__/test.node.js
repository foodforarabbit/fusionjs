import test from 'tape-cup';

import App, {createPlugin} from 'fusion-core';
import {createToken} from 'fusion-tokens';
import {getSimulator} from 'fusion-test-utils';

import AuthHeadersPlugin, {AuthHeadersUUIDConfigToken} from '../server';

const memoizedMock = {
  has: () => false,
  set: () => null,
};

const MockPluginToken = createToken('test-plugin-token');
function createTestFixture() {
  const app = new App('content', el => el);
  app.register(MockPluginToken, AuthHeadersPlugin);
  return app;
}

test('exported as expected', t => {
  t.ok(AuthHeadersPlugin, 'plugin defined as expected');
  t.equal(typeof AuthHeadersPlugin, 'object', 'plugin is an object');
  t.end();
});

test('auth headers plugin resolved in test plugin', t => {
  const app = createTestFixture();

  t.plan(1);
  getSimulator(
    app,
    createPlugin({
      deps: {authHeaders: MockPluginToken},
      provides: deps => {
        const {authHeaders} = deps;
        t.ok(authHeaders, 'plugin defined as expected');
      },
    })
  );

  t.end();
});

test('missing auth param', t => {
  const app = createTestFixture();

  t.plan(1);
  getSimulator(
    app,
    createPlugin({
      deps: {authHeaders: MockPluginToken},
      provides: deps => {
        const {authHeaders} = deps;
        t.throws(
          () => authHeaders.get('uuid'),
          'should throw if missing auth key'
        );
      },
    })
  );

  t.end();
});

test('service - get authentication param from context', t => {
  const mockContext = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
    memoized: memoizedMock,
  };

  const app = createTestFixture();

  t.plan(1);
  getSimulator(
    app,
    createPlugin({
      deps: {authHeaders: MockPluginToken},
      provides: deps => {
        const {authHeaders} = deps;
        const service = authHeaders.from(mockContext);
        t.equal(
          service.get('uuid'),
          mockContext.request.headers['x-auth-params-uuid'],
          'correct value associated with uuid provided by service.'
        );
      },
    })
  );

  t.end();
});

test('get authentication param from override', t => {
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

  t.plan(1);
  getSimulator(
    app,
    createPlugin({
      deps: {authHeaders: MockPluginToken},
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
    })
  );

  t.end();
});
