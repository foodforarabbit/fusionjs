// @flow
/* eslint-env node */
/* eslint-disable import/no-dynamic-require */

// require is used so this file can be bundled by ncc into single JS file

import {exec} from '@dubstep/core';
import type {UpgradeStrategy} from '../types.js';

// $FlowFixMe
const websitePkg = require(`${__dirname}/../../templates/template-website/package.json`);
// $FlowFixMe
const gqlPkg = require(`${__dirname}/../../templates/template-website-graphql/package.json`);

const deps = {
  ...getFusionVersions(),
  ...websitePkg.dependencies,
  ...websitePkg.devDependencies,
  ...gqlPkg.dependencies,
  ...gqlPkg.devDependencies,
};

const cache = {};

export async function getLatestVersion(
  dep: string,
  strategy: UpgradeStrategy,
  current: ?string
): Promise<string> {
  if (strategy === 'edge') {
    return (
      cache[dep] ||
      exec(`npm info ${dep} versions --json 2>/dev/null`).then(list => {
        cache[dep] = `^${JSON.parse(list).pop()}`;
        return cache[dep];
      })
    );
  } else if (strategy === 'curated') {
    cache[dep] = deps[dep] || current;
    if (cache[dep]) {
      return cache[dep];
    }
    return getLatestVersion(dep, 'latest');
  } else {
    return (
      cache[dep] ||
      exec(`npm info ${dep} version --json 2>/dev/null`).then(v => {
        cache[dep] = `^${JSON.parse(v)}`;
        return cache[dep];
      })
    );
  }
}

function getFusionVersions() {
  let versionedPackages = {};
  try {
    // $FlowFixMe
    versionedPackages = require(`${__dirname}/../../templates/versioned_packages.json`);
  } catch (e) {
    // If doesn't exist, use empty object
  }
  const fusionVersionMap = {};
  Object.keys(versionedPackages).forEach(dep => {
    fusionVersionMap[dep] = versionedPackages[dep].version;
  });
  return fusionVersionMap;
}
