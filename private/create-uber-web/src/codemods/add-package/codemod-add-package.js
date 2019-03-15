// @flow
import {getLatestVersion} from '../../utils/get-latest-version.js';
import {withJsonFile} from '@dubstep/core';
import type {UpgradeStrategy} from '../../types.js';

type AddOptions = {
  name: string,
  dir: string,
  strategy: UpgradeStrategy,
};

export const addPackage = async ({name, dir, strategy}: AddOptions) => {
  if (strategy === 'curated') strategy = 'latest';
  await withJsonFile(`${dir}/package.json`, async pkg => {
    pkg.dependencies = {
      ...(pkg.dependencies || {}),
      [name]: await getLatestVersion(name, strategy),
    };
  });
};
