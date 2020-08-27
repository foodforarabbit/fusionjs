// @flow
import {getLatestVersion} from '../../utils/get-latest-version.js';
import {withJsonFile} from '@dubstep/core';
import type {UpgradeStrategy} from '../../types.js';

type AddOptions = {
  name: string,
  dir: string,
  strategy: UpgradeStrategy,
  dev?: boolean,
  forceVersion?: boolean,
};

export const addPackage = async ({
  name,
  dir,
  strategy,
  dev,
  forceVersion = true,
}: AddOptions) => {
  if (strategy === 'curated') strategy = 'latest';
  await withJsonFile(`${dir}/package.json`, async pkg => {
    const version = await getLatestVersion(name, strategy);
    const dependencies = pkg.dependencies || {};
    const devDependencies = pkg.devDependencies || {};
    if (dev) {
      delete dependencies[name];
      if (forceVersion) {
        devDependencies[name] = version;
      } else {
        devDependencies[name] = devDependencies[name] || version;
      }
    } else {
      delete devDependencies[name];
      if (forceVersion) {
        dependencies[name] = version;
      } else {
        dependencies[name] = dependencies[name] || version;
      }
    }
    pkg.dependencies = dependencies;
    pkg.devDependencies = devDependencies;
  });
};
