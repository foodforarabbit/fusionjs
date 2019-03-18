// @flow
import {exec} from '@dubstep/core';
import fs from 'fs';
import type {UpgradeStrategy} from '../types.js';

const meta = JSON.parse(
  fs.readFileSync(`${__dirname}/../../templates/website/package.json`, 'utf8')
);

const cache = {};

export async function getLatestVersion(
  dep: string,
  strategy: UpgradeStrategy,
  current: ?string
): Promise<string> {
  if (strategy === 'edge') {
    return (
      cache[dep] ||
      exec(`npm info ${dep} versions --json`).then(list => {
        cache[dep] = `^${JSON.parse(list).pop()}`;
        return cache[dep];
      })
    );
  } else if (strategy === 'curated') {
    cache[dep] =
      (meta.dependencies && meta.dependencies[dep]) ||
      (meta.devDependencies && meta.devDependencies[dep]) ||
      current;
    return cache[dep];
  } else {
    return (
      cache[dep] ||
      exec(`npm info ${dep} version`).then(v => {
        cache[dep] = `^${v}`;
        return cache[dep];
      })
    );
  }
}
