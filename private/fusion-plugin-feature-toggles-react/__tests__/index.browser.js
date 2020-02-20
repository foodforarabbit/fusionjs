// @flow
/* eslint-env browser */

import {getService} from 'fusion-test-utils';
import App from 'fusion-core';

import FeatureTogglesPlugin from '../src/index.js';

/* App Creator(s) */
const appCreator = () => () => {
  const app = new App('el', el => el);
  app.register(FeatureTogglesPlugin);
  return app;
};

test('hydration from element', async () => {
  // Set up __FEATURE_TOGGLES__ element
  const mockHydrationState = {
    data: {
      toggleOn: {
        enabled: true,
      },
      toggleOff: {
        enabled: false,
      },
    },
  };
  const scriptElem = document.createElement('script');
  scriptElem.setAttribute('type', 'application/json');
  scriptElem.setAttribute('id', '__FEATURE_TOGGLES__');
  scriptElem.textContent = JSON.stringify(mockHydrationState);
  if (!document.body) throw new Error('Missing document.body');
  document.body.appendChild(scriptElem);

  // Check that the Feature Toggles service can resolve toggle data
  const service = getService(appCreator(), FeatureTogglesPlugin);
  const instance = service.from();

  const onResult = await instance.get('toggleOn');
  expect(onResult).not.toBeNull();
  if (!onResult) throw new Error('onResult is null!'); // necessary to appease Flow
  expect(onResult).toHaveProperty('enabled');
  expect(onResult.enabled).toBeTruthy();

  const offResult = await instance.get('toggleOff');
  expect(offResult).not.toBeNull();
  if (!offResult) throw new Error('offResult is null!'); // necessary to appease Flow
  expect(offResult).toHaveProperty('enabled');
  expect(offResult.enabled).not.toBeTruthy();

  const missingResult = await instance.get('missingToggle');
  expect(missingResult).not.toBeNull();
  if (!missingResult) throw new Error('missingResult is null!'); // necessary to appease Flow
  expect(missingResult).toHaveProperty('enabled');
  expect(missingResult.enabled).not.toBeTruthy();
});
