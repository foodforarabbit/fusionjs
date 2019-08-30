// @flow

import {remove} from 'fs-extra';
import {writeFile} from '@dubstep/core';
import {installFlowLibdefs} from './install-flow-libdefs.js';
import {exec} from './exec.js';

jest.mock('./exec.js');
// $FlowFixMe
exec.mockImplementation(async cmd => cmd);

test('installFlowLibdefs does not execute command when package not installed', async () => {
  const dir = 'libdef-fixture-no-matches';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{}}');
  await installFlowLibdefs({
    dir,
    packages: ['koa'],
  });
  expect(exec).not.toHaveBeenCalled();
  await remove(dir);
});

test('installFlowLibdefs runs command when package is installed', async () => {
  const dir = 'libdef-fixture-runs-command';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{"koa":"^2.0.0"}}');
  await installFlowLibdefs({
    dir,
    packages: ['koa'],
  });
  expect(exec).toHaveBeenCalledWith(
    'flow-typed install koa',
    expect.anything()
  );
  await remove(dir);
});

test('installFlowLibdefs runs command with hardcoded version', async () => {
  const dir = 'libdef-fixture-uses-hardcoded';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{}}');
  await installFlowLibdefs({
    dir,
    packages: ['koa@2'],
  });
  expect(exec).toHaveBeenCalledWith(
    'flow-typed install koa@2',
    expect.anything()
  );
  await remove(dir);
});

test('installFlowLibdefs removes hardcoded version when package is installed', async () => {
  const dir = 'libdef-fixture-remove-hardcoded';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{"koa":"^2.0.0"}}');
  await installFlowLibdefs({
    dir,
    packages: ['koa@2'],
  });
  expect(exec).toHaveBeenCalledWith(
    'flow-typed install koa',
    expect.anything()
  );
  await remove(dir);
});

test('installFlowLibdefs runs command with hardcoded version on scoped packages', async () => {
  const dir = 'libdef-fixture-uses-hardcoded-scoped';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{}}');
  await installFlowLibdefs({
    dir,
    packages: ['@uber/lib@2'],
  });
  expect(exec).toHaveBeenCalledWith(
    'flow-typed install @uber/lib@2',
    expect.anything()
  );
  await remove(dir);
});

test('installFlowLibdefs removes hardcoded version on scoped packages', async () => {
  const dir = 'libdef-fixture-removes-hardcoded-scoped';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{"@uber/lib":"^1.0.0"}}');
  await installFlowLibdefs({
    dir,
    packages: ['@uber/lib@2'],
  });
  expect(exec).toHaveBeenCalledWith(
    'flow-typed install @uber/lib',
    expect.anything()
  );
  await remove(dir);
});

test('installFlowLibdefs handles multiple packages', async () => {
  const dir = 'libdef-fixture-multiple';
  const file = `${dir}/package.json`;
  await writeFile(file, '{"dependencies":{"koa":"^2.0.0"}}');
  await installFlowLibdefs({
    dir,
    packages: ['koa@2', 'react', 'react-redux@7.1.0'],
  });
  expect(exec).toHaveBeenCalledWith(
    'flow-typed install koa react-redux@7.1.0',
    expect.anything()
  );
  await remove(dir);
});
