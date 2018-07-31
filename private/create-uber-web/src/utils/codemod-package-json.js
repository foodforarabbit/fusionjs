/* @flow */

import fse from 'fs-extra';
import {getNodeVersion} from './get-node-version.js';
import {getNpmVersion} from './get-npm-version.js';
import {getYarnVersion} from './get-yarn-version.js';
import {getUserName} from './get-user-name.js';
import {getUserEmail} from './get-user-email.js';
import {replaceNunjucksFile} from './replace-nunjucks-file.js';
import packageJson from '../../package.json';

export const codemodPackageJson = async ({
  name,
  description,
  team,
}: {
  name: string,
  description: string,
  team: string,
}) => {
  await replaceNunjucksFile(`${name}/package.json`, {
    project: name,
    description,
    gitName: await getUserName(),
    email: await getUserEmail(),
    team,
    nodeVersion: await getNodeVersion(),
    npmVersion: await getNpmVersion(),
    yarnVersion: await getYarnVersion(),
    version: packageJson.version,
  });
};
