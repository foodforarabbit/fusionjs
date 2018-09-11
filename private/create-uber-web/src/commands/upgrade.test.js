/* @flow */

import proc from 'child_process';
import {readFile, writeFile} from '@dubstep/core';
import fse from 'fs-extra';
import {upgrade} from './upgrade.js';

test('upgrade', async () => {
  const dir = 'fixtures/upgrade';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies": {"fusion-core": "0.1.0"}}');
  await upgrade({dir, skipInstall: true});
  const data = await readFile(file);
  expect(data.includes('0.1.0')).toEqual(false);
  await fse.remove(dir);
});
