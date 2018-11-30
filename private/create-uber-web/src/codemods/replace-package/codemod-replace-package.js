// @flow
import {types as t} from '@babel/core';
import {withJsFiles, step, readFile, exec} from '@dubstep/core';

export default (target: string, replacement: string) =>
  step('codemod-replace-package', async () => {
    const pkg = JSON.parse(await readFile('package.json'));
    const deps = Object.assign(
      pkg.dependencies || {},
      pkg.devDependencies || {}
    );
    if (!deps[target]) {
      return;
    }
    await exec(`yarn remove ${target} --ignore-engines`);
    if (!deps[replacement]) {
      await exec(`yarn add ${replacement} --ignore-engines`);
    }

    await withJsFiles('src/**/*.js', path => {
      let shouldUpdate = false;
      path.traverse({
        ImportDeclaration(ipath) {
          if (ipath.node.source.value === target) {
            ipath.node.source = t.stringLiteral(replacement);
            shouldUpdate = true;
          }
        },
      });
      return shouldUpdate;
    });
  });
