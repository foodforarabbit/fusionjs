/* @flow */

import {pathExists, readFile} from 'fs-extra';
import yaml from 'js-yaml';

export const checkServiceDirectory = async () => {
  const exists = await Promise.all([
    pathExists(process.cwd() + '/udeploy/pinocchio.yaml'),
    pathExists(process.cwd() + '/package.json'),
  ]);

  if (exists.filter(Boolean).length < 2) {
    throw new Error(
      'Provisioning must be run from within your root project directory.'
    );
  }

  // Check service name in pinocchio file
  try {
    const yamlFile = await readFile(
      process.cwd() + '/udeploy/pinocchio.yaml',
      'utf8'
    );
    const yamlContents = yaml.safeLoad(yamlFile);
    if (yamlContents.service_name) {
      return yamlContents.service_name;
    }

    throw 'no_service_name';
  } catch (e) {
    throw new Error(
      'Error reading from udeploy/pinocchio.yaml file. Please ensure that the file includes a service_name field.'
    );
  }
};
