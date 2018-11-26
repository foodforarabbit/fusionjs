/* @flow */

import {remove} from 'fs-extra';
import {writeFile, readFile} from '@dubstep/core';
import {replaceNunjucksFile} from './replace-nunjucks-file.js';

test('replaceNunjucksFile works', async () => {
  expect.assertions(1);
  const file = '__nunjucks__.njk';
  await writeFile(file, '{{test}}');
  await replaceNunjucksFile(file, {test: 'data'});
  await expect(readFile(file)).resolves.toEqual('data');
  await remove(file);
});
