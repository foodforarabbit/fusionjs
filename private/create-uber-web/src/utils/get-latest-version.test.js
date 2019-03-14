/* @flow */

import {getLatestVersion} from './get-latest-version.js';

test('getLatestVersion works', async () => {
  const version = await getLatestVersion('fusion-cli', 'default');
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});
test('getLatestVersion edge', async () => {
  const version = await getLatestVersion('fusion-cli', 'default');
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});
test('getLatestVersion default', async () => {
  const version = await getLatestVersion('fusion-cli', 'default', '^0.0.0');
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});
