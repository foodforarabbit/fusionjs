import {types as t} from '@babel/core';
import {step, readFile, exec} from '@dubstep/core';
export default name =>
  step('codemod-replace-package', async () => {
    const pkg = JSON.parse(await readFile('package.json'));
    const deps = Object.assign(
      pkg.dependencies || {},
      pkg.devDependencies || {},
    );
    if (deps[name]) {
      return;
    }
    await exec(`yarn add ${name} --ignore-engines`);
  });
