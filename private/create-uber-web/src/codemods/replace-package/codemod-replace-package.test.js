// @flow
import codemod from './codemod-replace-package';
import {writeFile, readFile, remove} from 'fs-extra';

jest.mock('@dubstep/core', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    ...actual,
    readFile: jest.fn(() => {
      return JSON.stringify({
        dependencies: {
          'fusion-react-async': '1',
        },
        devDependencies: {},
      });
    }),
    writeFile: jest.fn(),
    exec: jest.fn(),
  };
});

jest.mock('../../utils/with-js-files.js', () => {
  // $FlowFixMe
  const actual = require.requireActual('@dubstep/core');
  return {
    withJsFiles: handler => {
      return actual.withJsFiles(
        './fixtures/fusion-react-async/fixture.js',
        handler
      );
    },
  };
});

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion: () => Promise.resolve('^1.0.0'),
  };
});

test('codemod-replace simple', async () => {
  const contents = `
import {prepared} from "fusion-react-async";
prepared('test');
`;
  const fixture = 'fixtures/fusion-react-async/fixture.js';
  await writeFile(fixture, contents);
  await codemod('fusion-react-async', 'fusion-react').step();
  const newContents = (await readFile(fixture)).toString();
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import {prepared} from \\"fusion-react\\";
prepared('test');
"
`);
  await remove(fixture);
});

test('codemod-replace complex', async () => {
  const contents = `
import {prepared, dispatched as d} from "fusion-react-async";
prepared('test');
d();
`;
  const fixture = 'fixtures/fusion-react-async/fixture.js';
  await writeFile(fixture, contents);
  await codemod('fusion-react-async', 'fusion-react').step();
  const newContents = (await readFile(fixture)).toString();
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import {prepared, dispatched as d} from \\"fusion-react\\";
prepared('test');
d();
"
`);
  await remove(fixture);
});
