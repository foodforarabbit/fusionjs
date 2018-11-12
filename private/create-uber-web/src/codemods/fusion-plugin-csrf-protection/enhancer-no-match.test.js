// @flow
import codemod from './enhancer';
import path from 'path';
import fse from 'fs-extra';

jest.mock('@dubstep/core', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    exec: jest.fn(),
    readFile: jest.fn(() => {
      return JSON.stringify({
        dependencies: {},
      });
    }),
  };
});

test('csrf protection enhancer codemod', async () => {
  await codemod.step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.exec).not.toBeCalled();
});
