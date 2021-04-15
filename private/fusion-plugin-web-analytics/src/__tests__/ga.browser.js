// @flow
/* eslint-env browser */
/* global global */
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import Plugin from '../index.js';
import {UberWebAnalyticsToken} from '../tokens';

import {testGAConfig} from '../fixtures/test-ga-config';

function appendConfig(config) {
  const mockConfigEl = document.createElement('div');
  mockConfigEl.id = '__ANALYTICS_CONFIG__';
  mockConfigEl.textContent = JSON.stringify(config);
  const HeadEl: any = document.head;
  HeadEl.appendChild(mockConfigEl);
  return {cleanupEl: () => HeadEl.removeChild(mockConfigEl)};
}

test('ga', async () => {
  const {cleanupEl} = appendConfig(testGAConfig);
  global.postMessage = jest.fn();

  const commands = [];
  global.ga = (function() {
    return (...cmds) => {
      commands.push(cmds);
    };
  })();

  expect.assertions(1);

  const app = new App('TestEl', el => el);
  const mockUniversalEvents = {on: () => {}, emit: jest.fn()};
  // $FlowFixMe
  app.register(UniversalEventsToken, mockUniversalEvents);
  app.register(UberWebAnalyticsToken, Plugin);
  const sim = getSimulator(app);

  await sim.render('/test');

  // Test that appId can be set
  let found = false;
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (
      cmd.length === 3 &&
      cmd[0] === 'testTrackingId.set' &&
      cmd[1] === 'appId' &&
      cmd[2] === 'testAppId'
    ) {
      found = true;
    }
  }
  expect(found).toBe(true);

  cleanupEl();
});
