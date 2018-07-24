/* @flow */

import inquirer from 'inquirer';
import {promptChoice} from './prompt-choice.js';

test('promptChoice', async () => {
  jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
    if (options.message.match(/foo/)) {
      return {value: options.choices[0]};
    }
  });
  const selection = await promptChoice('foo', {a: 1, b: 2});
  expect(selection).toEqual(1);
});
