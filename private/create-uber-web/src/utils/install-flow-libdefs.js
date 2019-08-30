// @flow
import {exec} from './exec.js';
import {withJsonFile} from '@dubstep/core';

export async function installFlowLibdefs({
  dir,
  packages,
}: {
  dir: string,
  packages: Array<string>,
}) {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };
    const libsToInstall = [];
    for (const lib of packages) {
      if (/[~:^]/.test(lib)) {
        // `flow-typed install` will fail because these characters are escaped
        throw new Error('Semver symbols and aliases not supported');
      }
      const versionIndex = lib.lastIndexOf('@');
      if (versionIndex > 0) {
        const libWithoutVersion = lib.slice(0, versionIndex);
        // `lib@x.x.x`
        // `@uber/lib@x.x.x`
        // force install
        if (deps[libWithoutVersion]) {
          // use local version over hardcoded one
          libsToInstall.push(libWithoutVersion);
        } else {
          libsToInstall.push(lib);
        }
      } else if (deps[lib]) {
        // `lib`
        // `@uber/lib`
        // only install if package is installed locally
        libsToInstall.push(lib);
      }
    }
    if (libsToInstall.length) {
      // escape to prevent accidentally dangerous things
      const escapedLibs = libsToInstall.map(lib => escape(lib)).join(' ');
      await exec(
        `flow-typed install ${escapedLibs}`,
        'Running `flow-typed install`'
      ).catch(e => {});
    }
    return pkg;
  });
}
