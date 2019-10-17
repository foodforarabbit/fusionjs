// @flow

import os from 'os';
import path from 'path';
import {remove} from 'fs-extra';
import readProvisioningConfig from './read-provisioning-config.js';
import writeProvisioningConfig from './write-provisioning-config.js';

test('readProvisioningConfig and writeProvisioningConfig work', async () => {
  expect.assertions(1);
  const config = {
    email: 'test@uber.com',
    serviceName: 'test-service',
    serviceTier: 5,
  };
  writeProvisioningConfig(config);
  const fullPath = path.resolve(os.tmpdir(), `${config.serviceName}.json`);
  const data = readProvisioningConfig(config.serviceName);
  expect(data).toEqual(config);
  await remove(fullPath);
});
