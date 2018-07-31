/* @flow */

import {checkYarnRegistry} from './check-yarn-registry.js';

test('checkYarnRegistry', () => {
  expect(checkYarnRegistry).not.toThrow();
});
