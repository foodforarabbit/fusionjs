/* @flow */

import {pathExists} from 'fs-extra';
import {prompt} from './prompt.js';

const SERVICE_NAME_TEST = new RegExp(/^[a-z][a-zA-Z-_0-9]*$/);

export const checkProjectName = async (
  name: ?string,
  root: string
): Promise<string> => {
  let projectName = name;
  if (!projectName) {
    projectName = await prompt('Project name:');
  }
  if (await pathExists(`${root}/${projectName}`)) {
    throw new Error(`A folder with the name ${projectName} already exists`);
  }
  if (projectName.endsWith('staging')) {
    throw new Error(
      'Do not add `-staging` at the end of the project name. It can cause routing issues when you provision'
    );
  }
  if (!SERVICE_NAME_TEST.test(projectName)) {
    throw new Error(
      'Invalid service name. Service names cannot start with a capital letter and can only contain alpha-numeric characters, hyphens, and underscores.'
    );
  }
  return projectName;
};
