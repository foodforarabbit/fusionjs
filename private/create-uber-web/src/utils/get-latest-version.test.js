/* @flow */

import {getLatestVersion} from './get-latest-version.js';

test('getLatestVersion works', async () => {
  const version = await getLatestVersion('fusion-cli', 'latest');
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});
test('getLatestVersion edge', async () => {
  const version = await getLatestVersion('fusion-cli', 'edge');
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});
test('getLatestVersion curated', async () => {
  const version = await getLatestVersion('fusion-cli', 'curated', '^0.0.0');
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});
