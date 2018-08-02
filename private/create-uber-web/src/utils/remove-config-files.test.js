/* @flow */

import fse from 'fs-extra';
import {writeFile} from '@dubstep/core';
import {removeConfigFiles} from './remove-config-files.js';

test('removeConfigFiles', async () => {
  const dir = '__remove_config_file__';

  await writeFile(`${dir}/.eslintignore`, '');
  await writeFile(`${dir}/.flowconfig`, '');
  await writeFile(`${dir}/.gitignore`, '');
  await writeFile(`${dir}/.cuprc`, '');

  await removeConfigFiles(dir);

  await expect(fse.pathExists(`${dir}/.eslintignore`)).resolves.toEqual(false);
  await expect(fse.pathExists(`${dir}/.flowconfig`)).resolves.toEqual(false);
  await expect(fse.pathExists(`${dir}/.gitignore`)).resolves.toEqual(false);
  await expect(fse.pathExists(`${dir}/.cuprc`)).resolves.toEqual(false);

  await fse.remove(dir);
});
