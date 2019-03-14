/* @flow */

import {upgrade} from './upgrade.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

jest.setTimeout(10000);

jest.mock('../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

test('upgrade', async () => {
  const root = 'fixtures/upgrade';
  const file = `${root}/package.json`;
  await writeFile(file, '{"dependencies": {"no-bugs": "0.0.0"}}');
  await upgrade({
    dir: root,
    match: '',
    codemod: true,
    force: true,
    strategy: 'default',
  });
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('0.0.0')).toBe(false);
  expect(data.includes('styletron-react')).toBe(true);
});
