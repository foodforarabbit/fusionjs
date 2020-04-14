/* @flow */

import {pathExists, readFile} from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import {checkAppMonorepoRoot} from './check-app-monorepo-root.js';

export const checkServiceDirectory = async (): Promise<{
  serviceName: string,
  pinocchioFilePath: string,
}> => {
  // Check if we are inside of the monorepo or inside of a stand-alone service
  // If we are inside of the monorepo, infer what service we are by the directory name
  const isMonorepo = await checkAppMonorepoRoot('../../../../..');

  let rootPath = '/';
  let pinocchioFilePath = 'udeploy/pinocchio.yaml';
  if (isMonorepo) {
    const {name: serviceDirectory} = path.parse(process.cwd());
    // Five directories up since we can only provision within the project itself
    rootPath = '../../../../../../';
    pinocchioFilePath = `udeploy/pinocchio/${serviceDirectory}.yaml`;
  }

  const filesExists = await Promise.all([
    pathExists(path.resolve(process.cwd() + rootPath + pinocchioFilePath)),
    pathExists(process.cwd() + '/package.json'),
  ]);
  const exists = filesExists.every(value => value === true);

  if (!exists) {
    throw new Error(
      'Cannot detect a uDeploy config file or a valid package.json file. Ensure you are running provisioning from your project directory.'
    );
  }

  // Check service name in pinocchio file
  try {
    const yamlFile = await readFile(
      path.resolve(process.cwd() + rootPath + pinocchioFilePath),
      'utf8'
    );
    const yamlContents = yaml.safeLoad(yamlFile);
    if (yamlContents.service_name) {
      return {serviceName: yamlContents.service_name, pinocchioFilePath};
    }

    throw 'no_service_name';
  } catch (e) {
    throw new Error(
      'Error reading from pinocchio.yaml file. Please ensure that the file includes a service_name field.'
    );
  }
};
