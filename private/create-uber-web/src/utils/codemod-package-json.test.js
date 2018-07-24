/* @flow */

import fse from 'fs-extra';
import {writeFile, readFile} from '@dubstep/core';
import {codemodPackageJson} from './codemod-package-json.js';

test('codemodPackageJson', async () => {
  const dir = '__codemodded_package_json__';
  const file = `${dir}/package.json`;
  await writeFile(`${file}`, '"{{description}}"');
  await codemodPackageJson({name: dir, description: 'a', team: 'a'});
  await expect(readFile(file)).resolves.toEqual('"a"');
  await fse.remove(dir);
});
