/* @flow */

import {pathExists, remove} from 'fs-extra';
import {writeFile} from '@dubstep/core';
import {removeConfigFiles} from './remove-config-files.js';

test('removeConfigFiles', async () => {
  const dir = '__remove_config_file__';

  await writeFile(`${dir}/.eslintignore`, '');
  await writeFile(`${dir}/.flowconfig`, '');
  await writeFile(`${dir}/.gitignore`, '');
  await writeFile(`${dir}/.cuprc`, '');

  await removeConfigFiles(dir);

  await expect(pathExists(`${dir}/.eslintignore`)).resolves.toEqual(false);
  await expect(pathExists(`${dir}/.flowconfig`)).resolves.toEqual(false);
  await expect(pathExists(`${dir}/.gitignore`)).resolves.toEqual(false);
  await expect(pathExists(`${dir}/.cuprc`)).resolves.toEqual(false);

  await remove(dir);
});
