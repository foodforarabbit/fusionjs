/* @flow */

import {readFile, writeFile} from '@dubstep/core';
import {remove} from 'fs-extra';
import {bumpDeps} from './bump-deps.js';

test('bumpDeps', async () => {
  const dir = 'fixtures/bump';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "0.0.0"}, "scripts": {"test": "echo ok"}}'
  );
  await bumpDeps({dir, match: '', force: true, edge: false});
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
  await bumpDeps({dir, match: '', force: false, edge: false}).catch(() => {});
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
  await bumpDeps({dir, match: '', force: false, edge: false}).catch(() => {});
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
  await bumpDeps({dir, match: '', force: true, edge: false}).catch(() => {});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(false);
  await remove(dir);
});

test('bumpDeps match', async () => {
  const dir = 'fixtures/bump-match';
  const file = `${dir}/package.json`;
  await writeFile(
    file,
    '{"dependencies": {"no-bugs": "0.0.0"}, "scripts": {"test": "echo ok"}}'
  );
  await bumpDeps({dir, match: 'asd', force: false, edge: false});
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
  await bumpDeps({dir, match: '', force: true, edge: true});
  const data = await readFile(file);
  expect(data.includes('0.0.0')).toEqual(false);
  await remove(dir);
});
