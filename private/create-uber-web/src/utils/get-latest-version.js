// @flow
import {exec} from '@dubstep/core';
import fs from 'fs';
import type {UpgradeStrategy} from '../types.js';

jest.setTimeout(15000);

const meta = JSON.parse(
  fs.readFileSync(`${process.cwd()}/templates/website/package.json`, 'utf8')
);

export function getLatestVersion(
  dep: string,
  strategy: UpgradeStrategy,
  current: ?string
): Promise<string> {
  if (strategy === 'edge') {
    return exec(`npm info ${dep} versions --json`).then(list => {
      return `^${JSON.parse(list).pop()}`;
    });
  } else if (strategy === 'curated') {
    return Promise.resolve(
      (meta.dependencies && meta.dependencies[dep]) ||
        (meta.devDependencies && meta.devDependencies[dep]) ||
        current
    );
  } else {
    return exec(`npm info ${dep} version`).then(v => `^${v}`);
  }
}
