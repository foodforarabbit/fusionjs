import test from 'tape-cup';
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import {SecureHeadersToken} from '../tokens.js';
import SecureHeadersPlugin from '../browser';

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

test('Service not supported on browser', t => {
  const app = createTestFixture();

  t.plan(2);
  getSimulator(
    app,
    createPlugin({
      deps: {SecureHeaders: SecureHeadersToken},
      provides: deps => {
        const {SecureHeaders} = deps;
        t.ok(SecureHeaders, 'plugin provided as expected');
        t.throws(
          SecureHeaders.from,
          'should throw if attempted to instantiate on browser'
        );
      },
    })
  );

  t.end();
});
