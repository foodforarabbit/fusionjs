// @flow
import {replacePackage} from './codemod-replace-package.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-replace simple', async () => {
  const contents = `
import {prepared} from "fusion-react-async";
prepared('test');
`;
  const root = 'fixtures/replace-simple';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackage({
    target: 'fusion-react-async',
    replacement: 'fusion-react',
    dir: root,
    edge: false,
  });
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import {prepared} from \\"fusion-react\\";
prepared('test');
"
`);
  await removeFile(root);
});

test('codemod-replace complex', async () => {
  const contents = `
import {prepared, dispatched as d} from "fusion-react-async";
prepared('test');
d();
`;
  const root = 'fixtures/replace-complex';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackage({
    target: 'fusion-react-async',
    replacement: 'fusion-react',
    dir: root,
    edge: false,
  });
  const newContents = await readFile(fixture);
  // $FlowFixMe
  expect(newContents).toMatchInlineSnapshot(`
"
import {prepared, dispatched as d} from \\"fusion-react\\";
prepared('test');
d();
"
`);
  await removeFile(root);
});
