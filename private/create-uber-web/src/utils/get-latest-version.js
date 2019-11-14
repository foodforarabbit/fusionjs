// @flow
import {exec} from '@dubstep/core';
import fs from 'fs';
import type {UpgradeStrategy} from '../types.js';

const websitePkg = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../templates/template-website/package.json`,
    'utf8'
  )
);
const gqlPkg = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../templates/template-website-graphql/package.json`,
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
      exec(`yarn info ${dep} versions --json 2>/dev/null`).then(list => {
        cache[dep] = `^${JSON.parse(list).data.pop()}`;
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
      exec(`yarn info ${dep} version --json 2>/dev/null`).then(v => {
        cache[dep] = `^${JSON.parse(v).data}`;
        return cache[dep];
      })
    );
  }
}
