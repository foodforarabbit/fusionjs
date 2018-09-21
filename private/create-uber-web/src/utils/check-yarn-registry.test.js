/* @flow */

import {checkYarnRegistry} from './check-yarn-registry.js';

test('checkYarnRegistry', async () => {
  await expect(checkYarnRegistry()).resolves.toBe(undefined);
});
