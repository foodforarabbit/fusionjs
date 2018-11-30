/* @flow */

import inquirer from 'inquirer';

export const promptChoice = async (
  message: string,
  choices: Array<string> | {[string]: string | number | boolean}
) => {
  const {value} = await inquirer.prompt({
    name: 'value',
    message,
    type: 'list',
    choices: choices instanceof Array ? choices : Object.keys(choices),
  });
  return choices instanceof Array ? value : choices[value];
};
