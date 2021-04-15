// @flow
/* eslint-env browser */
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';

import Plugin from '../index.js';
import {UberWebAnalyticsToken} from '../tokens';

test('Browser Plugin(without hydration)', async () => {
  expect.assertions(1);

  const app = new App('TestEl', el => el);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(UberWebAnalyticsToken, Plugin);
  const sim = getSimulator(app);

  expect(async function() {
    await sim.render('/test');
  }).not.toThrow();
});
