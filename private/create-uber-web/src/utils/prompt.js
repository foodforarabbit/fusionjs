/* @flow */

import inquirer from 'inquirer';

export const prompt = async (message: string) => {
  const {value} = await inquirer.prompt({
    name: 'value',
    message,
    type: 'input',
  });
  return value;
};
