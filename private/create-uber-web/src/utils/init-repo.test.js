/* @flow */

import {writeFile} from '@dubstep/core';
import {pathExists, remove} from 'fs-extra';
import {initRepo} from './init-repo.js';

test('initRepo', async () => {
  const root = process.cwd();
  const name = `__init_repo__`;
  const file = `${name}/test.txt`;
  await writeFile(file, 'test');
  await initRepo(root, name, 'web');
  await expect(pathExists(`${root}/${name}/.git`)).resolves.toEqual(true);
  await remove(name);
});
