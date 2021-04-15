// @flow
/* eslint-env browser */
/* global global */
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import Plugin from '../index.js';
import {UberWebAnalyticsToken} from '../tokens';

import {testWebHeatpipeConfig} from '../fixtures/test-web-heatpipe-config';

function appendConfig(config) {
  const mockConfigEl = document.createElement('div');
  mockConfigEl.id = '__ANALYTICS_CONFIG__';
  mockConfigEl.textContent = JSON.stringify(config);
  const HeadEl: any = document.head;
  HeadEl.appendChild(mockConfigEl);
  return {cleanupEl: () => HeadEl.removeChild(mockConfigEl)};
}

test('web-heatpipe can transform a schema and emit the correct payload', async () => {
  const {cleanupEl} = appendConfig(testWebHeatpipeConfig);
  global.postMessage = jest.fn();
  global.referrer = 'google.com';

  expect.assertions(2);

  const app = new App('TestEl', el => el);
  const mockUniversalEvents = {on: () => {}, emit: jest.fn()};
  // $FlowFixMe
  app.register(UniversalEventsToken, mockUniversalEvents);
  app.register(UberWebAnalyticsToken, Plugin);
  const sim = getSimulator(app);
  const webAnalyticsService = sim.getService(UberWebAnalyticsToken);

  webAnalyticsService.track('main.click', {
    flag: true,
    code: 200,
    unset: undefined,
  });

  expect(mockUniversalEvents.emit.mock.calls[0][0]).toEqual(
    'custom-hp-web-event'
  );
  expect(mockUniversalEvents.emit.mock.calls[0][1]).toEqual({
    name: 'main.click',
    type: 'action',
    value_map: {
      custom: 'google.com',
      flag: 'true',
      code: '200',
    },
  });

  cleanupEl();
});
