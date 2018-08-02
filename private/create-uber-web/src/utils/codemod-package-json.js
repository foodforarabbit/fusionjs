/* @flow */

import {withJsonFile} from '@dubstep/core';
import {getNodeVersion} from './get-node-version.js';
import {getNpmVersion} from './get-npm-version.js';
import {getYarnVersion} from './get-yarn-version.js';
import {getUserName} from './get-user-name.js';
import {getUserEmail} from './get-user-email.js';
import {replaceNunjucksFile} from './replace-nunjucks-file.js';
import packageJson from '../../package.json';

type PackageJsonCodemodData = {
  type: string,
  name: string,
  description: string,
  team: string,
  hoistDeps: boolean,
};

export const codemodPackageJson = async ({
  type,
  name,
  description,
  team,
  hoistDeps,
}: PackageJsonCodemodData) => {
  await replaceNunjucksFile(`${name}/package.json`, {
    description,
    gitName: await getUserName(),
    email: await getUserEmail(),
    team,
    version: packageJson.version,
  });
  await withJsonFile(`${name}/package.json`, async data => {
    data.name = type === 'website' ? name : `@uber/${name}`;
    data.engines.node = await getNodeVersion();
    data.engines.npm = await getNpmVersion();
    data.engines.yarn = await getYarnVersion();

    if (hoistDeps) {
      delete data.babel;
      delete data.jest;
      delete data.eslintConfig;
      delete data.dependencies;
      delete data.devDependencies;
      delete data.peerDependencies;
    }
    return data;
  });
};
