/* @flow */

import inquirer from 'inquirer';
import {prompt} from './prompt.js';

test('promptChoice', async () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
    return {value: 'a'};
  });
  const selection = await prompt('foo');
  expect(selection).toEqual('a');
});
