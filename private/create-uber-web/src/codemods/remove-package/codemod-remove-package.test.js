// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {removePackage} from './codemod-remove-package.js';

test('codemod-remove-package, no existing', async () => {
  const root = 'fixtures/remove';
  const file = `${root}/package.json`;
  await writeFile(file, '{"dependencies": {"no-bugs": "0.0.1"}}');
  await removePackage({name: 'no-bugs', dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('no-bugs')).toBe(false);
});
