// @flow
/* eslint-env browser */
/* global global */
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';

import Plugin from '../index.js';
import {UberWebAnalyticsToken} from '../tokens';

import {
  testTealiumConfig,
  testTealiumReduxStore,
} from '../fixtures/test-tealium-config';

function appendConfig(config) {
  const mockConfigEl = document.createElement('div');
  mockConfigEl.id = '__ANALYTICS_CONFIG__';
  mockConfigEl.textContent = JSON.stringify(config);
  const HeadEl: any = document.head;
  HeadEl.appendChild(mockConfigEl);
  return {cleanupEl: () => HeadEl.removeChild(mockConfigEl)};
}

test('Tealium', async () => {
  const {cleanupEl} = appendConfig(testTealiumConfig);
  global.postMessage = jest.fn();
  global.utag = {link: jest.fn()};

  expect.assertions(3);

  const app = new App('TestEl', el => el);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(UberWebAnalyticsToken, Plugin);
  app.middleware(
    {webAnalytics: UberWebAnalyticsToken},
    ({webAnalytics}) => async (ctx, next) => {
      webAnalytics.eventContext.setReduxState(testTealiumReduxStore);
      webAnalytics.track('GET_OFFERS_SUCCESS', {
        type: 'GET_OFFERS_SUCCESS',
        payload: {},
      });
      return next();
    }
  );
  const sim = getSimulator(app);

  await sim.render('/test');

  expect(global.postMessage.mock.calls[0][0]).toMatchSnapshot();
  expect(global.postMessage.mock.calls[1][0]).toMatchSnapshot();
  expect(global.utag.link.mock.calls[0][0]).toMatchSnapshot();

  cleanupEl();
});
