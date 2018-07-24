/* @flow */

import {getNodeVersion} from './get-node-version.js';

test('getNodeVersion works', async () => {
  await expect(getNodeVersion()).resolves.toEqual(expect.stringContaining('.'));
});
