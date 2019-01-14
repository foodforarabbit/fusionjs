/* @flow */

import {readFile, writeFile} from '@dubstep/core';
import semver from 'semver';
import {install, test as runTests} from './yarn';
import log from './log';
import {getProgress} from './progress';
import {getLatestVersion} from './get-latest-version';

type BumpOptions = {
  dir: string,
  match: string,
  force: boolean,
  edge: boolean,
};

export const bumpDeps = async ({dir, match, force, edge}: BumpOptions) => {
  log.title('Updating dependencies');
  const file = `${dir}/package.json`;
  const data = await read(file).catch(() => null);
  if (data) {
    if (force) {
      await batchUpgrade({dir, match, file, data, edge});
    } else {
      await runTests(dir);
      await upgrade({dir, match, file, data, edge, key: 'dependencies'});
      await upgrade({dir, match, file, data, edge, key: 'devDependencies'});
      await upgrade({dir, match, file, data, edge, key: 'peerDependencies'});
    }
  }
};

const read = async file => {
  return JSON.parse(await readFile(file));
};
const write = async (file, data) => {
  writeFile(file, JSON.stringify(data, null, 2));
};

const installAndTest = async dir => {
  await install(dir);
  await runTests(dir);
};

const batchUpgrade = async ({dir, match, file, data, edge}) => {
  const keys = ['dependencies', 'devDependencies', 'peerDependencies'];
  const promises = [];
  keys.forEach(key => {
    if (!data[key]) return;
    for (const dep in data[key]) {
      if (['babel-core'].includes(dep)) continue;
      if (!new RegExp(match).test(dep)) continue;
      promises.push(
        getLatestVersion(dep, edge).then(v => {
          progress.tick();
          const old = data[key][dep].replace(/\^/, '');
          const curr = v.replace(/\^/, '');
          if (semver.gt(curr, old)) data[key][dep] = v;
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

const upgrade = async ({dir, match, file, data, key, edge}) => {
  if (!data[key]) return;
  for (const dep in data[key]) {
    const version = data[key][dep];
    if (['babel-core'].includes(dep)) continue;
    if (!new RegExp(match).test(dep)) continue;
    data[key][dep] = await getLatestVersion(dep, edge);
    if (data[key][dep] === version) continue;
    await write(file, data);
    await installAndTest(dir).catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Could not upgrade ${dep}`);
      const old = data[key][dep].replace(/\^/, '');
      const curr = version.replace(/\^/, '');
      if (semver.gt(curr, old)) data[key][dep] = version;
      return write(file, data);
    });
  }
};
