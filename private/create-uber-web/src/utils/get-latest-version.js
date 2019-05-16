// @flow
import {exec} from '@dubstep/core';
import fs from 'fs';
import type {UpgradeStrategy} from '../types.js';

const websitePkg = JSON.parse(
  fs.readFileSync(`${__dirname}/../../templates/website/package.json`, 'utf8')
);
const gqlPkg = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../templates/website-graphql/package.json`,
    'utf8'
  )
);

const deps = {
  ...gqlPkg.dependencies,
  ...gqlPkg.devDependencies,
  ...websitePkg.dependencies,
  ...websitePkg.devDependencies,
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
      exec(`yarn info ${dep} versions --json`).then(list => {
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
      exec(`yarn info ${dep} version`).then(v => {
        cache[dep] = `^${v}`;
        return cache[dep];
      })
    );
  }
}
