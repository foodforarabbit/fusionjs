// @flow
import {getLatestVersion} from '../../utils/get-latest-version';
import {step, readFile, writeFile} from '@dubstep/core';

export default (name: string) =>
  step('codemod-replace-package', async () => {
    const pkg = JSON.parse(await readFile('package.json'));
    const deps = Object.assign(
      pkg.dependencies || {},
      pkg.devDependencies || {}
    );
    if (deps[name]) {
      return;
    }
    pkg.dependencies[name] = await getLatestVersion(name);
    writeFile('package.json', JSON.stringify(pkg, null, 2));
  });
