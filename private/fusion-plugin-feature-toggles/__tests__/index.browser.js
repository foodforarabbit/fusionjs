// @flow
/* eslint-env browser */

import {getService} from 'fusion-test-utils';
import App from 'fusion-core';

import FeatureTogglesPlugin from '../src/browser.js';

/* App Creator(s) */
const appCreator = () => () => {
  const app = new App('el', el => el);
  app.register(FeatureTogglesPlugin);
  return app;
};

function setScriptContent(content: string): HTMLScriptElement {
  const scriptElem = document.createElement('script');
  scriptElem.setAttribute('type', 'application/json');
  scriptElem.setAttribute('id', '__FEATURE_TOGGLES__');
  scriptElem.textContent = content;
  if (!document.body) throw new Error('Missing document.body');
  document.body.appendChild(scriptElem);

  return scriptElem;
}
function cleanupScriptContent(elem: HTMLScriptElement): void {
  if (!document.body) throw new Error('Missing document.body');
  document.body.removeChild(elem);
}

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

  const scriptElem = setScriptContent(JSON.stringify(mockHydrationState));

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

  cleanupScriptContent(scriptElem);
});

test('missing hydration failure', async () => {
  const service = getService(appCreator(), FeatureTogglesPlugin);

  // Should not throw, and fallback to empty (i.e. no data)
  let scriptElem = setScriptContent(JSON.stringify({}));
  const instance = service.from();
  await instance.load();
  // $FlowFixMe
  expect(instance.data).toEqual([]);
  cleanupScriptContent(scriptElem);

  // Should throw -- no __FEATURE_TOGGLES__ element
  await expect(instance.load()).rejects.toThrow();

  // Should throw -- unable to parse __FEATURE_TOGGLES__ element
  scriptElem = setScriptContent('INVALID_CONTENT');
  await expect(instance.load()).rejects.toThrow();
  cleanupScriptContent(scriptElem);
});
