/* @flow */

import {readFile, writeFile} from '@dubstep/core';
import {install, test} from './yarn';
import log from './log';
import {getProgress} from './progress';
import {getLatestVersion} from './get-latest-version';

export const bumpDeps = async (dir: string, match: string, force: boolean) => {
  log.title('Updating dependencies');
  const file = `${dir}/package.json`;
  const data = await read(file).catch(() => null);
  if (data) {
    if (force) {
      await batchUpgrade(dir, match, file, data);
    } else {
      await test(dir);
      await upgrade(dir, match, file, data, 'dependencies');
      await upgrade(dir, match, file, data, 'devDependencies');
      await upgrade(dir, match, file, data, 'peerDependencies');
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
  await test(dir);
};

const batchUpgrade = async (dir, match, file, data) => {
  const keys = ['dependencies', 'devDependencies', 'peerDependencies'];
  const promises = [];
  keys.forEach(key => {
    if (!data[key]) return;
    for (const dep in data[key]) {
      if (['babel-core'].includes(dep)) continue;
      if (!new RegExp(match).test(dep)) continue;
      promises.push(
        getLatestVersion(dep).then(v => {
          progress.tick();
          data[key][dep] = v;
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

const upgrade = async (dir, match, file, data, key) => {
  if (!data[key]) return;
  for (const dep in data[key]) {
    const version = data[key][dep];
    if (['babel-core'].includes(dep)) continue;
    if (!new RegExp(match).test(dep)) continue;
    data[key][dep] = await getLatestVersion(dep);
    if (data[key][dep] === version) continue;
    await write(file, data);
    await installAndTest(dir).catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Could not upgrade ${dep}`);
      data[key][dep] = version;
      return write(file, data);
    });
  }
};
