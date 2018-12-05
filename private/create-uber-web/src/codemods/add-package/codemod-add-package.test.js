// @flow
import codemod from './codemod-add-package';

jest.mock('@dubstep/core', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    writeFile: jest.fn(),
    readFile: jest.fn(),
  };
});

test('codemod-add-package, no existing', async () => {
  require('@dubstep/core').readFile.mockImplementationOnce(() => {
    return JSON.stringify({
      dependencies: {},
    });
  });
  require('@dubstep/core').writeFile.mockClear();
  await codemod('test').step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.writeFile).toHaveBeenCalled();
});

test('replace-codemod, existing', async () => {
  require('@dubstep/core').readFile.mockImplementationOnce(() => {
    return JSON.stringify({
      dependencies: {
        test: '1',
      },
    });
  });
  require('@dubstep/core').writeFile.mockClear();
  await codemod('test').step();
  const dubstep = require('@dubstep/core');
  expect(dubstep.writeFile).not.toBeCalled();
});
