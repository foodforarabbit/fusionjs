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

test('checkMajorVersion passes with range having a lower bound satisfying the supported version', () => {
  expect(checkMajorVersion('^10.0.0', '10.16.3')).toEqual(true);
  expect(checkMajorVersion('^10.0.0 || ^12.0.0', '10.16.3')).toEqual(true);
  expect(checkMajorVersion('>=10.0.0 <11', '10.16.3')).toEqual(true);
});

test('checkMajorVersion fails with range having a lower bound lower than the supported version', () => {
  expect(checkMajorVersion('^8.0.0', '10.16.3')).toEqual(false);
  expect(checkMajorVersion('^8.0.0 || ^10.0.0', '10.16.3')).toEqual(false);
  expect(checkMajorVersion('>=8.0.0 <11', '10.16.3')).toEqual(false);
});
