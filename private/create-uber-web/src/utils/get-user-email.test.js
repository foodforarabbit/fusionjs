/* @flow */

import {getUserEmail} from './get-user-email.js';

test('getUserEmail works', async () => {
  await expect(getUserEmail()).resolves.toEqual(expect.stringContaining('@'));
});
