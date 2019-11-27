/* @flow */

import {checkMajorVersion} from './check-major-version.js';

test('checkMajorVersion passes with higher value', () => {
  expect(checkMajorVersion('11.5.4', '10.16.3')).toEqual(true);
});

test('checkMajorVersion passes with same major value', () => {
  expect(checkMajorVersion('10.5.4', '10.16.3')).toEqual(true);
});

test('checkMajorVersion fails with lower major value', () => {
  expect(checkMajorVersion('9.5.4', '10.16.3')).toEqual(false);
});
