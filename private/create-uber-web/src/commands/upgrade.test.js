/* @flow */

import proc from 'child_process';
import {readFile, writeFile} from '@dubstep/core';
import {remove} from 'fs-extra';
import {upgrade} from './upgrade.js';

test('upgrade', async () => {
  const dir = 'fixtures/upgrade';
  const file = `${dir}/package.json`;
  await writeFile(`${dir}/src/test.js`, '');
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "0.0.0"}, "scripts": {"test": "echo ok"}}',
  );
  await upgrade({dir, match: '', force: true});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(false);
  await remove(dir);
});
