/* @flow */

import inquirer from 'inquirer';
import {checkProjectName} from './check-project-name.js';

test('checkProjectName', async () => {
  const result = await checkProjectName('service-name', 'root');
  expect(result).toEqual('service-name');
});

test('checkProjectName with numbers', async () => {
  const result = await checkProjectName('service-name-2', 'root');
  expect(result).toEqual('service-name-2');
});

test('checkProjectName fails if name has staging', async () => {
  await expect(
    checkProjectName('service-name-staging', 'root')
  ).rejects.toThrow(Error);
});

test('checkProjectName fails if name starts with a capital letter', async () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
    return {value: 'Malformed-name'};
  });
  expect.assertions(1);
  await expect(checkProjectName(undefined, 'root')).rejects.toThrowError(Error);
});

test('checkProjectName fails if name contains symbols', async () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
    return {value: 'service-name!@#$'};
  });
  expect.assertions(1);
  await expect(checkProjectName(undefined, 'root')).rejects.toThrowError(Error);
});
