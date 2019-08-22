// @flow
import {withJsonFile} from '@dubstep/core';

type AddOptions = {
  name: string,
  dir: string,
  script: string,
};

export const addPackageScript = async ({name, dir, script}: AddOptions) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    const scripts = pkg.scripts || {};
    scripts[name] = script;
    pkg.scripts = scripts;
  });
};
