// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addPackageScript} from './codemod-add-package-script.js';

test('codemod-add-packages-script, add', async () => {
  const root = 'fixtures/add-new';
  const file = `${root}/package.json`;
  await writeFile(file, '{"scripts": {"dev": "do some things"}}');
  await addPackageScript({name: 'hi', dir: root, script: 'yarn says hi'});
  const data = await readFile(file);
  await removeFile(root);

  const dataObj = JSON.parse(data);
  expect(Object.keys(dataObj.scripts).length).toEqual(2);
  expect(dataObj.scripts.dev).toEqual('do some things');
  expect(dataObj.scripts.hi).toEqual('yarn says hi');
});

test('codemod-add-package-script, replace', async () => {
  const root = 'fixtures/add-new';
  const file = `${root}/package.json`;
  await writeFile(
    file,
    '{"scripts": {"dev": "do some things", "hi": "not quite right"}}'
  );
  await addPackageScript({name: 'hi', dir: root, script: 'yarn says hi'});
  const data = await readFile(file);
  await removeFile(root);

  const dataObj = JSON.parse(data);
  expect(Object.keys(dataObj.scripts).length).toEqual(2);
  expect(dataObj.scripts.dev).toEqual('do some things');
  expect(dataObj.scripts.hi).toEqual('yarn says hi');
});
