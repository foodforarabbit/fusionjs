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
  pathExists.mockReturnValue(Promise.resolve(true));
  readFile.mockReturnValue(Promise.resolve(true));
  yaml.safeLoad.mockReturnValue({service_name: 'hello'});
  await expect(checkServiceDirectory()).resolves.toBe('hello');
});

test('checkServiceDirectory when one file does not exist', async () => {
  pathExists.mockReturnValueOnce(Promise.resolve(true));
  await expect(checkServiceDirectory()).rejects;
});

test('checkServiceDirectory when service_name does not exist in yaml file', async () => {
  pathExists.mockReturnValue(Promise.resolve(true));
  readFile.mockReturnValue(Promise.resolve(true));
  yaml.safeLoad.mockReturnValue({});
  await expect(checkServiceDirectory()).rejects;
});
