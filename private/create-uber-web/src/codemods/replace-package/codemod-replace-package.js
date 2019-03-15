// @flow
import {types as t} from '@babel/core';
import {withJsonFile} from '@dubstep/core';
import {withJsFiles} from '../../utils/with-js-files.js';
import log from '../../utils/log.js';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import type {UpgradeStrategy} from '../../types.js';

type ReplaceOptions = {
  target: string,
  replacement: string,
  dir: string,
  strategy: UpgradeStrategy,
};

export const replacePackage = async ({
  target,
  replacement,
  dir,
  strategy,
}: ReplaceOptions) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    await replace(pkg, 'dependencies', target, replacement, strategy);
    await replace(pkg, 'devDependencies', target, replacement, strategy);
  });
  await withJsFiles(dir, path => {
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
};

async function replace(pkg, group, target, replacement, strategy) {
  if (strategy === 'curated') strategy = 'latest';
  if (pkg[group] && pkg[group][target]) {
    log.title(`Replacing ${target} with ${replacement}`);
    delete pkg[group][target];
    pkg[group][replacement] = await getLatestVersion(replacement, strategy);
  }
}
