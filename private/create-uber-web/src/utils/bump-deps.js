/* @flow */

import {readFile, exec, writeFile} from '@dubstep/core';
import {install, test} from './yarn';

export const bumpDeps = async (dir: string, match: string, force: boolean) => {
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

function getLatestVersion(dep: string): Promise<string> {
  return exec(`npm info ${dep} version`).then(v => `^${v}`);
}

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
          data[key][dep] = v;
        })
      );
    }
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
