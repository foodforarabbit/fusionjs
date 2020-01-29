/* @flow */

import {readFile, writeFile} from '@dubstep/core';
import semver from 'semver';
import {install, test as runTests} from './yarn';
import log from './log';
import {getProgress} from './progress';
import {getLatestVersion} from './get-latest-version';
import type {UpgradeStrategy} from '../types.js';

const BLACKLIST = ['babel-core', 'create-universal-package'];

type BumpOptions = {
  dir: string,
  match: string,
  force: boolean,
  strategy: UpgradeStrategy,
};

export const bumpDeps = async ({dir, match, force, strategy}: BumpOptions) => {
  log.title('Updating dependencies');
  const file = `${dir}/package.json`;
  const data = await read(file).catch(() => null);
  if (data) {
    if (force) {
      await batchUpgrade({dir, match, file, data, strategy});
    } else {
      const options = {dir, match, file, data, strategy};
      await runTests(dir);
      await upgrade({...options, key: 'dependencies'});
      await upgrade({...options, key: 'devDependencies'});
    }
  }
};

const read = async file => {
  return JSON.parse(await readFile(file));
};
const write = async (file, data) => {
  return writeFile(file, JSON.stringify(data, null, 2));
};

const installAndTest = async dir => {
  await install(dir);
  await runTests(dir);
};

const batchUpgrade = async ({dir, match, file, data, strategy}) => {
  const keys = ['dependencies', 'devDependencies'];
  const promises = [];
  keys.forEach(key => {
    if (!data[key]) return;
    for (const dep in data[key]) {
      if (BLACKLIST.includes(dep)) continue;
      if (!new RegExp(match).test(dep)) continue;
      promises.push(
        getLatestVersion(dep, strategy, data[key][dep]).then(v => {
          progress.tick();
          const old = data[key][dep].replace(/\^|~/, '');
          const curr = v.replace(/\^|~/, '');
          if (!semver.valid(old) || semver.gt(curr, old)) {
            data[key][dep] = v;
          } else if (
            strategy === 'curated' &&
            /canary/.test(curr) &&
            /fusion/.test(dep)
          ) {
            // Override default logic for upgrading fusion canary deps
            data[key][dep] = v;
          }
        })
      );
    }
  });
  const progress = getProgress({
    total: promises.length,
    title: 'Updating package.json',
  });
  await Promise.all(promises);
  await write(file, data);
  await install(dir);
};

const upgrade = async ({dir, match, file, data, key, strategy}) => {
  if (!data[key]) return;
  for (const dep in data[key]) {
    const version = data[key][dep];
    if (BLACKLIST.includes(dep)) continue;
    if (!new RegExp(match).test(dep)) continue;
    data[key][dep] = await getLatestVersion(dep, strategy, data[key][dep]);
    if (data[key][dep] === version) continue;
    await write(file, data);
    await installAndTest(dir).catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Could not upgrade ${dep}`);
      const old = data[key][dep].replace(/\^|~/, '');
      const curr = version.replace(/\^|~/, '');
      if (semver.gt(curr, old)) data[key][dep] = version;
      return write(file, data);
    });
  }
};
