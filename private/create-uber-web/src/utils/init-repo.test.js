/* @flow */

import {writeFile, exec} from '@dubstep/core';
import fse from 'fs-extra';
import {initRepo} from './init-repo.js';

test('initRepo', async () => {
  const name = `__init_repo__`;
  const file = `${name}/test.txt`;
  await writeFile(file, 'test');
  await initRepo(name, 'web');
  await expect(fse.pathExists(`${name}/.git`)).resolves.toEqual(true);
  await fse.remove(name);
});
