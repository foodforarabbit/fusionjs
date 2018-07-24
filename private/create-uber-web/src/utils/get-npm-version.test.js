/* @flow */

import {getNpmVersion} from './get-npm-version.js';

test('getNpmVersion works', async () => {
  const version = getNpmVersion('8.11.3');
  await expect(version).resolves.toEqual(expect.stringContaining('.'));
});
