/* @flow */

import {remove} from 'fs-extra';
import {writeFile, readFile} from '@dubstep/core';
import {codemodReadme} from './codemod-readme.js';

test('codemodReadme', async () => {
  const dir = '__codemodded_readme__';
  const file = `${dir}/README.md`;
  await writeFile(`${file}`, '{{description}}');
  await codemodReadme({path: file, name: dir, description: 'a', team: 'a'});
  await expect(readFile(file)).resolves.toEqual('a');
  await remove(dir);
});
