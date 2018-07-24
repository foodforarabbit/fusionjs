/* @flow */

import {getUserName} from './get-user-name.js';

test('getUserName works', async () => {
  await expect(getUserName()).resolves.toEqual(expect.stringContaining(''));
});
