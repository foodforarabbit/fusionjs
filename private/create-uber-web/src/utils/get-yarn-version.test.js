/* @flow */

import {getYarnVersion} from './get-yarn-version.js';

test('getYarnVersion works', async () => {
  await expect(getYarnVersion()).resolves.toEqual(expect.stringContaining('.'));
});
