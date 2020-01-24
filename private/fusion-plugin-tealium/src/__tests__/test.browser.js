// @flow
/* eslint-env browser */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import TealiumPlugin from '../browser';
import {TealiumToken} from '../tokens';

function createTestFixture() {
  const app = new App('content', el => el);
  app.register(TealiumToken, TealiumPlugin);
  return app;
}

test('plugin - exported as expected', () => {
  expect(TealiumPlugin).toBeTruthy();
  expect(typeof TealiumPlugin).toBe('object');
});

test('plugin - service resolved as expected', () => {
  const app = createTestFixture();

  let wasResolved = false;
  getSimulator(
    app,
    createPlugin({
      deps: {tealium: TealiumToken},
      provides: deps => {
        const {tealium} = deps;
        expect(tealium).toBeTruthy();
        wasResolved = true;
      },
    })
  );

  expect(wasResolved).toBeTruthy();
});

test('service - API as expected', done => {
  if (TealiumPlugin.provides) {
    const service = TealiumPlugin.provides({});
    expect(typeof service.pageview).toBe('function');
    expect(typeof service.identify).toBe('function');
    expect(typeof service.track).toBe('function');

    done();
  }
});
