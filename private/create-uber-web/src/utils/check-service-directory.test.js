/* @flow */

import {checkServiceDirectory} from './check-service-directory.js';
import {pathExists, readFile} from 'fs-extra';
import yaml from 'js-yaml';

jest.mock('fs-extra', () => ({
  readFile: jest.fn(),
  pathExists: jest.fn(),
}));

jest.mock('js-yaml', () => ({
  safeLoad: jest.fn(),
}));

test('checkServiceDirectory when all files exist', async () => {
  (pathExists: any).mockReturnValue(Promise.resolve(true));
  (readFile: any).mockReturnValue(Promise.resolve(true));
  (yaml.safeLoad: any).mockReturnValue({service_name: 'hello'});
  await expect(checkServiceDirectory()).resolves.toBe('hello');
});

test('checkServiceDirectory when one file does not exist', async () => {
  (pathExists: any).mockReturnValueOnce(Promise.resolve(false));
  (pathExists: any).mockReturnValueOnce(Promise.resolve(true));
  await expect(checkServiceDirectory()).rejects.toMatchInlineSnapshot(
    `[Error: Provisioning must be run from within your root project directory.]`
  );
});

test('checkServiceDirectory when service_name does not exist in yaml file', async () => {
  (pathExists: any).mockReturnValue(Promise.resolve(true));
  (readFile: any).mockReturnValue(Promise.resolve(true));
  (yaml.safeLoad: any).mockReturnValue({});
  await expect(checkServiceDirectory()).rejects.toMatchInlineSnapshot(
    `[Error: Error reading from udeploy/pinocchio.yaml file. Please ensure that the file includes a service_name field.]`
  );
});
