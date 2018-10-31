/* @flow */

import {readFile, exec, writeFile} from '@dubstep/core';

export const bumpDeps = async (dir: string, match: string, force: boolean) => {
  const file = `${dir}/package.json`;
  const data = await read(file).catch(() => null);
  if (data) {
    if (!force) await test(dir);
    await upgrade(dir, match, force, file, data, 'dependencies');
    await upgrade(dir, match, force, file, data, 'devDependencies');
    await upgrade(dir, match, force, file, data, 'peerDependencies');
    await writeFile(file, JSON.stringify(data, null, 2));
  }
};

const read = async file => {
  return JSON.parse(await readFile(file));
};
const write = async (file, data) => {
  writeFile(file, JSON.stringify(data));
};
const install = async dir => {
  return exec(`yarn install --silent --ignore-engines --ignore-scripts`, {
    cwd: dir,
  });
};
const test = async dir => {
  await install(dir);
  return exec(`yarn test`, {cwd: dir});
};

const upgrade = async (dir, match, force, file, data, key) => {
  if (!data[key]) return;
  for (const dep in data[key]) {
    const version = data[key][dep];
    if (['babel-core'].includes(dep)) continue;
    if (!new RegExp(match).test(dep)) continue;
    data[key][dep] = await exec(`npm info ${dep} version`).then(
      v => `^${v}`,
      () => data[key][dep],
    );
    if (data[key][dep] === version) continue;
    await write(file, data);
    if (!force) {
      await test(dir).catch(e => {
        console.log(`Could not upgrade ${dep}`);
        data[key][dep] = version;
        return write(file, data);
      });
    }
  }
};
