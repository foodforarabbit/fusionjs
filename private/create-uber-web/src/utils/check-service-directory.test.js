/* @flow */

import {checkServiceDirectory} from './check-service-directory.js';
import {pathExists, readFile} from 'fs-extra';
import {checkAppMonorepoRoot} from './check-app-monorepo-root.js';
import yaml from 'js-yaml';

jest.mock('fs-extra', () => ({
  readFile: jest.fn(),
  pathExists: jest.fn(),
}));

jest.mock('js-yaml', () => ({
  safeLoad: jest.fn(),
}));

jest.mock('./check-app-monorepo-root.js', () => ({
  checkAppMonorepoRoot: jest.fn(),
}));

test('checkServiceDirectory when all files exist', async () => {
  (pathExists: any).mockReturnValue(Promise.resolve(true));
  (readFile: any).mockReturnValue(Promise.resolve(true));
  (checkAppMonorepoRoot: any).mockReturnValue(Promise.resolve(false));
  (yaml.safeLoad: any).mockReturnValue({service_name: 'hello'});
  await expect(checkServiceDirectory()).resolves.toStrictEqual({
    pinocchioFilePath: 'udeploy/pinocchio.yaml',
    serviceName: 'hello',
  });
});

test('checkServiceDirectory when all files exist in the monorepo', async () => {
  (checkAppMonorepoRoot: any).mockReturnValue(Promise.resolve(true));
  (pathExists: any).mockReturnValue(Promise.resolve(true));
  (readFile: any).mockReturnValue(Promise.resolve(true));
  (yaml.safeLoad: any).mockReturnValue({service_name: 'hello'});
  await expect(checkServiceDirectory()).resolves.toStrictEqual({
    pinocchioFilePath: 'udeploy/pinocchio/create-uber-web.yaml',
    serviceName: 'hello',
  });
});

test('checkServiceDirectory when one file does not exist', async () => {
  (pathExists: any).mockReturnValueOnce(Promise.resolve(false));
  (pathExists: any).mockReturnValueOnce(Promise.resolve(true));
  await expect(checkServiceDirectory()).rejects.toMatchInlineSnapshot(
    `[Error: Cannot detect a uDeploy config file or a valid package.json file. Ensure you are running provisioning from your project directory.]`
  );
});

test('checkServiceDirectory when service_name does not exist in yaml file', async () => {
  (pathExists: any).mockReturnValue(Promise.resolve(true));
  (readFile: any).mockReturnValue(Promise.resolve(true));
  (yaml.safeLoad: any).mockReturnValue({});
  await expect(checkServiceDirectory()).rejects.toMatchInlineSnapshot(
    `[Error: Error reading from pinocchio.yaml file. Please ensure that the file includes a service_name field.]`
  );
});
