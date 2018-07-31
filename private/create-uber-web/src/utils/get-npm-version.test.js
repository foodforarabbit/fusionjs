/* @flow */

import {getNpmVersion} from './get-npm-version.js';

test('getNpmVersion works', async () => {
  const version = getNpmVersion();
  await expect(version).resolves.toEqual(expect.stringContaining('.'));
});
