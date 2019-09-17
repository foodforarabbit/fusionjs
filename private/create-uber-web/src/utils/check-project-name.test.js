/* @flow */

import inquirer from 'inquirer';
import {checkProjectName} from './check-project-name.js';

test('checkProjectName', async () => {
  const result = await checkProjectName('service-name', 'root');
  expect(result).toEqual('service-name');
});

test('checkProjectName fails if name has staging', async () => {
  try {
    await checkProjectName('service-name-staging', 'root');
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

test('checkProjectName fails if name starts with a capital letter', async () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
    return {value: 'Malformed-name'};
  });
  expect.assertions(1);
  try {
    await checkProjectName(undefined, 'root');
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

test('checkProjectName fails if name contains symbols', async () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
    return {value: 'service-name!@#$'};
  });
  expect.assertions(1);
  try {
    await checkProjectName(undefined, 'root');
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
