// @flow
import codemod from './codemod-add-package';
import path from 'path';

jest.mock('@dubstep/core', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    exec: jest.fn(),
    readFile: jest.fn(),
  };
});

test('codemod-add-package, no existing', async () => {
  require('@dubstep/core').readFile.mockImplementationOnce(() => {
    return JSON.stringify({
      dependencies: {},
    });
  });
  await codemod('test').step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.exec).toBeCalled();
});

test('replace-codemod, existing', async () => {
  require('@dubstep/core').readFile.mockImplementationOnce(() => {
    return JSON.stringify({
      dependencies: {
        test: '1',
      },
    });
  });
  require('@dubstep/core').exec.mockClear();
  await codemod('test').step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.exec).not.toBeCalled();
});
