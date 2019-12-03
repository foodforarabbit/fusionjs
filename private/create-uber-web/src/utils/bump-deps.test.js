/* @flow */

import {readFile, writeFile} from '@dubstep/core';
import {remove} from 'fs-extra';
import {bumpDeps} from './bump-deps.js';
import semver from 'semver';

jest.mock('../utils/get-latest-version.js', () => ({
  getLatestVersion: () => Promise.resolve('^1.0.0'),
}));

jest.mock('../utils/yarn.js', () => ({
  install() {
    return Promise.resolve();
  },
  // $FlowFixMe
  test: require.requireActual('../utils/yarn.js').test,
}));

test('bumpDeps', async () => {
  const dir = 'fixtures/bump';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "0.0.0"}, "scripts": {"test": "echo ok"}}'
  );
  await bumpDeps({dir, match: '', force: true, strategy: 'latest'});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(false);
  await remove(dir);
});

test('bumpDeps bails out if untestable', async () => {
  const dir = 'fixtures/bump-bails';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    `{
      "dependencies": {
        "no-bugs": "0.0.0"
      },
      "scripts": {
        "test": "exit 1"
      }
    }`
  );
  await bumpDeps({
    dir,
    match: '',
    force: false,
    strategy: 'latest',
  }).catch(() => {});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(true);
  await remove(dir);
});

test('bumpDeps rolls back if regression', async () => {
  const dir = 'fixtures/bump-regression';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    `{
      "dependencies": {
        "no-bugs": "0.0.0"
      },
      "scripts": {
        "test": "grep -q 0.0.0 package.json || exit 1;"
      }
    }`
  );
  await bumpDeps({
    dir,
    match: '',
    force: false,
    strategy: 'latest',
  }).catch(() => {});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(true);
  await remove(dir);
});

test('bumpDeps force', async () => {
  const dir = 'fixtures/bump-force';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    `{
      "dependencies": {
        "no-bugs": "0.0.0"
      },
      "scripts": {
        "test": "exit 1"
      }
    }`
  );
  await bumpDeps({
    dir,
    match: '',
    force: true,
    strategy: 'latest',
  }).catch(() => {});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(false);
  await remove(dir);
});

test('bumpDeps force replaces bad version', async () => {
  const dir = 'fixtures/bump-force-bad-version';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    `{
      "dependencies": {
        "no-bugs": "0.0"
      },
      "scripts": {
        "test": "exit 0"
      }
    }`
  );
  await bumpDeps({
    dir,
    match: '',
    force: true,
    strategy: 'latest',
  }).catch(() => {});
  const data = await readFile(file);
  const badVersion = JSON.parse(data).dependencies['no-bugs'].replace(
    /[^\d.]/,
    ''
  );
  expect(badVersion).not.toEqual('0.0');
  expect(semver.valid(badVersion)).not.toBeNull();
  await remove(dir);
});

test('bumpDeps match', async () => {
  const dir = 'fixtures/bump-match';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "0.0.0"}, "scripts": {"test": "echo ok"}}'
  );
  await bumpDeps({dir, match: 'asd', force: false, strategy: 'latest'});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(true);
  await remove(dir);
});

test('bumpDeps edge', async () => {
  const dir = 'fixtures/bump-edge';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "0.0.0"}, "scripts": {"test": "echo ok"}}'
  );
  await bumpDeps({dir, match: '', force: true, strategy: 'edge'});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(false);
  await remove(dir);
});

test('bumpDeps curated', async () => {
  const dir = 'fixtures/bump-curated';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "1.0.0"}, "scripts": {"test": "echo ok"}}'
  );
  await bumpDeps({dir, match: '', force: true, strategy: 'curated'});
  const data = await readFile(file);
  expect(data.includes('1.0.0')).toEqual(true);
  await remove(dir);
});
