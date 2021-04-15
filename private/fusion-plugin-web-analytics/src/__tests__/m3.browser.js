// @flow
/* eslint-env browser */
/* global global */
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import Plugin from '../index.js';
import {UberWebAnalyticsToken} from '../tokens';

import {testM3Config, testM3NestedConfig} from '../fixtures/test-m3-config';

function appendConfig(config) {
  const mockConfigEl = document.createElement('div');
  mockConfigEl.id = '__ANALYTICS_CONFIG__';
  mockConfigEl.textContent = JSON.stringify(config);
  const HeadEl: any = document.head;
  HeadEl.appendChild(mockConfigEl);
  return {cleanupEl: () => HeadEl.removeChild(mockConfigEl)};
}

test('M3', async () => {
  const {cleanupEl} = appendConfig(testM3Config);
  global.postMessage = jest.fn();
  global.utag = {link: jest.fn()};

  expect.assertions(3);

  const app = new App('TestEl', el => el);
  const mockUniversalEvents = {on: () => {}, emit: jest.fn()};
  // $FlowFixMe
  app.register(UniversalEventsToken, mockUniversalEvents);
  app.register(UberWebAnalyticsToken, Plugin);
  app.middleware(
    {webAnalytics: UberWebAnalyticsToken},
    ({webAnalytics}) => async (ctx, next) => {
      webAnalytics.eventContext.setReduxState({});
      webAnalytics.track('CREATE_USER_SUCCESS');
      return next();
    }
  );
  const sim = getSimulator(app);

  await sim.render('/test');

  expect(global.postMessage.mock.calls[0][0]).toMatchSnapshot();
  expect(global.postMessage.mock.calls[1][0]).toMatchSnapshot();
  expect(mockUniversalEvents.emit.mock.calls[0]).toMatchSnapshot();

  cleanupEl();
});

test('Nested schema for M3', async () => {
  const {cleanupEl} = appendConfig(testM3NestedConfig);
  global.postMessage = jest.fn();
  global.utag = {link: jest.fn()};

  expect.assertions(4);

  const app = new App('TestEl', el => el);
  const mockUniversalEvents = {on: () => {}, emit: jest.fn()};
  // $FlowFixMe
  app.register(UniversalEventsToken, mockUniversalEvents);
  app.register(UberWebAnalyticsToken, Plugin);
  app.middleware(
    {webAnalytics: UberWebAnalyticsToken},
    ({webAnalytics}) => async (ctx, next) => {
      webAnalytics.eventContext.setReduxState({});
      webAnalytics.track('CREATE_USER_SUCCESS', {data: 'test-1'});
      webAnalytics.track('CREATE_USER_SUCCESS', {data: 'test-2'});
      return next();
    }
  );
  const sim = getSimulator(app);

  await sim.render('/test');

  expect(global.postMessage.mock.calls[0][0]).toMatchSnapshot();
  expect(global.postMessage.mock.calls[1][0]).toMatchSnapshot();
  expect(mockUniversalEvents.emit.mock.calls[0]).toMatchSnapshot();
  expect(mockUniversalEvents.emit.mock.calls[1]).toMatchSnapshot();

  cleanupEl();
});
