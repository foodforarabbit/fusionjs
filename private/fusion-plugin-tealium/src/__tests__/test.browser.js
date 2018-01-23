/* eslint-env browser */
import test from 'tape-cup';

import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import TealiumPlugin from '../browser';
import {TealiumToken} from '../tokens';

function createTestFixture() {
  const app = new App('content', el => el);
  app.register(TealiumToken, TealiumPlugin);
  return app;
}

test('plugin - exported as expected', t => {
  t.ok(TealiumPlugin, 'plugin defined as expected');
  t.equal(typeof TealiumPlugin, 'object', 'plugin is an object');
  t.end();
});

test('plugin - service resolved as expected', t => {
  const app = createTestFixture();

  let wasResolved = false;
  getSimulator(
    app,
    createPlugin({
      deps: {tealium: TealiumToken},
      provides: deps => {
        const {tealium} = deps;
        t.ok(tealium);
        wasResolved = true;
      },
    })
  );

  t.true(wasResolved, 'test plugin was resolved');
  t.end();
});

test('service - API as expected', t => {
  const service = TealiumPlugin.provides();
  t.equal(
    typeof service.pageview,
    'function',
    'service.pageview method exists'
  );
  t.equal(
    typeof service.identify,
    'function',
    'service.identify method exists'
  );
  t.equal(typeof service.track, 'function', 'service.track method exists');

  t.end();
});
