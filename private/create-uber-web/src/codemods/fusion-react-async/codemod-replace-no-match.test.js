// @flow
import codemod from './codemod-replace';
import path from 'path';

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

test('fusion-react-async replace-codemod no match', async () => {
  await codemod.step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.exec).not.toBeCalled();
});
