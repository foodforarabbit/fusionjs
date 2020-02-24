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
  path: string,
  type: string,
  name: string,
  description: string,
  team: string,
  hoistDeps: boolean,
};

export const codemodPackageJson = async ({
  path,
  type,
  name,
  description,
  team,
  hoistDeps,
}: PackageJsonCodemodData) => {
  await replaceNunjucksFile(`${path}`, {
    description,
    name,
    author: await getUserName(),
    email: await getUserEmail(),
    team,
    version: packageJson.version,
  });
  await withJsonFile(`${path}`, async data => {
    if (type.startsWith('website')) {
      data.engines.node = await getNodeVersion();
      data.engines.npm = await getNpmVersion();
      data.engines.yarn = await getYarnVersion();
      data.name = name;
    } else {
      data.name = `@uber/${name}`;
      data.engines = packageJson.engines;
    }

    if (data.__files) {
      // Don't npmignore the files in the templates when publishing create-uber-web
      data.files = data.__files;
      delete data.__files;
    }

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
