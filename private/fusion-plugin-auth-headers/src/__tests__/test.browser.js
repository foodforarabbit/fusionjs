import test from 'tape-cup';

import App, {createPlugin} from 'fusion-core';
import {createToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import AuthHeadersPlugin from '../browser';

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

test('arguments and service not supported on browser', t => {
  const app = createTestFixture();

  t.plan(2);
  getSimulator(
    app,
    createPlugin({
      deps: {authHeaders: MockPluginToken},
      provides: deps => {
        const {authHeaders} = deps;
        t.ok(authHeaders, 'plugin defined as expected');
        t.throws(
          authHeaders.from,
          'should throw if attempted to instantiate on browser'
        );
      },
    })
  );

  t.end();
});
