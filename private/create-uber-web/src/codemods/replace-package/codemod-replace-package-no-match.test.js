// @flow
import codemod from './codemod-replace-package';

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

test('replace-codemod no match', async () => {
  await codemod('no-match', 'replacement').step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.exec).not.toBeCalled();
});
