// @flow
import {types as t} from '@babel/core';
import {step, readFile, writeFile} from '@dubstep/core';
import {withJsFiles} from '../../utils/with-js-files';
import log from '../../utils/log';
import {getLatestVersion} from '../../utils/get-latest-version';

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

    log.title(`Replacing ${target} with ${target}`);
    delete pkg.dependencies[target];
    delete pkg.devDependencies[target];
    pkg.dependencies[replacement] = await getLatestVersion(replacement);
    await writeFile('package.json', JSON.stringify(pkg, null, 2));
    await withJsFiles(path => {
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
