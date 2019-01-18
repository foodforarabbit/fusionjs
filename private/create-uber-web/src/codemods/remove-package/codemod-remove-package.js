// @flow
import {withJsonFile} from '@dubstep/core';

type RemoveOptions = {
  name: string,
  dir: string,
};

export const removePackage = async ({name, dir}: RemoveOptions) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (pkg.dependencies) delete pkg.dependencies[name];
    if (pkg.devDependencies) delete pkg.devDependencies[name];
  });
};
