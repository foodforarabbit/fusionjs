/* @flow */

import {readFile, exec, writeFile} from '@dubstep/core';

export const bumpDeps = async (dir: string) => {
  const file = `${dir}/package.json`;
  const data = await read(file).catch(() => null);
  if (data) {
    await Promise.all([
      upgrade(data, 'dependencies'),
      upgrade(data, 'devDependencies'),
      upgrade(data, 'peerDependencies'),
    ]);
    await writeFile(file, JSON.stringify(data, null, 2));
  }
};

const read = async file => {
  return JSON.parse(await readFile(file));
};

const upgrade = async (data, key) => {
  if (!data[key]) return;
  for (const dep in data[key]) {
    if (['babel-core'].includes(dep)) continue;
    data[key][dep] = await exec(`npm info ${dep} version`).then(
      v => `^${v}`,
      () => data[key][dep],
    );
  }
};
