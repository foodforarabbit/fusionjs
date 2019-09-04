/* @flow */

import fs from 'fs';
import {upgrade} from './upgrade.js';
import {writeFile, removeFile} from '@dubstep/core';

jest.mock('../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

jest.mock('../utils/get-teams.js', () => ({
  getTeams: () => ['web'],
}));

jest.mock('../utils/yarn.js', () => {
  return {
    install: jest.fn(),
    test: jest.fn(),
  };
});

jest.mock('../utils/install-flow-libdefs.js', () => {
  return {
    installFlowLibdefs: jest.fn(),
  };
});

test('upgrade', async () => {
  const root = 'fixtures/upgrade';
  const file = `${root}/package.json`;
  await writeFile(file, '{"dependencies": {"no-bugs": "0.0.0"}}');
  await upgrade({
    dir: root,
    match: '',
    codemod: true,
    force: true,
    strategy: 'latest',
  });
  const data = fs.readFileSync(file, 'utf8');
  await removeFile(root);
  expect(data.includes('0.0.0')).toBe(false);
  expect(data.includes('styletron-react')).toBe(true);
});
