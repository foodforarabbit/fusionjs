/* @flow */

import fse from 'fs-extra';
import {writeFile, readFile} from '@dubstep/core';
import {codemodPackageJson} from './codemod-package-json.js';

test('codemodPackageJson', async () => {
  const dir = '__codemodded_package_json__';
  const file = `${dir}/package.json`;
  await writeFile(
    `${file}`,
    '{"name":"name","__files":[],"dependencies":{},"engines":{"node":"0","npm":"0","yarn":"0"}}',
  );
  await codemodPackageJson({
    type: 'website',
    name: dir,
    description: 'a',
    team: 'a',
    hoistDeps: false,
  });
  const data = await readFile(file);
  expect(/"name": "name"/.test(data)).toEqual(false);
  expect(/"name": "@uber/.test(data)).toEqual(false);
  expect(/"files"/.test(data)).toEqual(true);
  expect(/"dependencies": {}/.test(data)).toEqual(true);
  await fse.remove(dir);
});

test('codemodPackageJson non-website', async () => {
  const dir = '__codemodded_package_json_non_website__';
  const file = `${dir}/package.json`;
  await writeFile(
    `${file}`,
    '{"name": "name", "dependencies": {}, "engines": {"node": "0", "npm": "0", "yarn": "0"}}',
  );
  await codemodPackageJson({
    type: 'library',
    name: dir,
    description: 'a',
    team: 'a',
    hoistDeps: true,
  });
  const data = await readFile(file);
  expect(/"name": "name"/.test(data)).toEqual(false);
  expect(/"name": "@uber/.test(data)).toEqual(true);
  expect(/"dependencies": {}/.test(data)).toEqual(false);
  await fse.remove(dir);
});
