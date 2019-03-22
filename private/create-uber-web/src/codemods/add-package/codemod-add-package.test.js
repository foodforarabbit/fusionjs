// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addPackage} from './codemod-add-package.js';

jest.mock('../../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

test('codemod-add-package, no existing', async () => {
  const root = 'fixtures/add-new';
  const file = `${root}/package.json`;
  await writeFile(file, '{"dependencies": {}}');
  await addPackage({name: 'no-bugs', dir: root, strategy: 'latest'});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('no-bugs')).toBe(true);
});

test('codemod-add-package, existing', async () => {
  const root = 'fixtures/overwrite';
  const file = `${root}/package.json`;
  await writeFile(file, '{"dependencies": {"no-bugs": "0.0.0"}}');
  await addPackage({name: 'no-bugs', dir: root, strategy: 'latest'});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('0.0.0')).toBe(false);
});
