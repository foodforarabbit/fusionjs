// @flow
/* eslint-env browser */
import FliprPlugin from '../browser.js';

test('plugin - exported corectly', () => {
  expect(FliprPlugin).toBeTruthy();
  // $FlowFixMe
  expect(FliprPlugin.provides).toBe(undefined);
  // $FlowFixMe
  expect(FliprPlugin.middleware).toBe(undefined);
});
