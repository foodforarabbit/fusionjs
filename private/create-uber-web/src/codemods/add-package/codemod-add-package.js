// @flow
import {getLatestVersion} from '../../utils/get-latest-version.js';
import {withJsonFile} from '@dubstep/core';

type AddOptions = {
  name: string,
  dir: string,
  edge: boolean,
};

export const addPackage = async ({name, dir, edge}: AddOptions) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    pkg.dependencies = {
      ...(pkg.dependencies || {}),
      [name]: await getLatestVersion(name, edge),
    };
  });
};
