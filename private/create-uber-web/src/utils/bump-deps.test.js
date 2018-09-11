/* @flow */

import proc from 'child_process';
import {readFile, writeFile} from '@dubstep/core';
import fse from 'fs-extra';
import {bumpDeps} from './bump-deps.js';

test('bumpDeps', async () => {
  const dir = 'fixtures/bump';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies": {"fusion-core": "0.1.0"}}');
  await bumpDeps(dir);
  const data = await readFile(file);
  expect(data.includes('0.1.0')).toEqual(false);
  await fse.remove(dir);
});
