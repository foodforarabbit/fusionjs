// @flow

import {
  removeFlowConfigLines,
  ensureFlowConfigLine,
  ensureMinimalFlowConfigVersion,
} from './codemod-flowconfig.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-flowconfig#removeFlowConfigLines handles non-existant file', async () => {
  const root = 'fixtures/no-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await removeFlowConfigLines({
    dir: root,
    section: 'ignore',
    pattern: /fusion/,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`""`);
  await removeFile(root);
});

test('codemod-flowconfig#removeFlowConfigLines handles empty file', async () => {
  const contents = ``;
  const root = 'fixtures/empty-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await removeFlowConfigLines({
    dir: root,
    section: 'ignore',
    pattern: /fusion/,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`""`);
  await removeFile(root);
});

test('codemod-flowconfig#removeFlowConfigLines removes correct lines', async () => {
  const contents = `💩fusion
[ignore]
.*/node_modules/fusion-core/flow-typed
.*/node_modules/fusion-react/flow-typed
;.*/node_modules/fusion-plugin-i18n/flow-typed
.*/node_modules/react/flow-typed

[libs]
.*/node_modules/fusion-react/flow-typed
.*/node_modules/react/flow-typed
`;
  const root = 'fixtures/remove-lines-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await removeFlowConfigLines({
    dir: root,
    section: 'ignore',
    pattern: /fusion/,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "💩fusion
    [ignore]
    ;.*/node_modules/fusion-plugin-i18n/flow-typed
    .*/node_modules/react/flow-typed

    [libs]
    .*/node_modules/fusion-react/flow-typed
    .*/node_modules/react/flow-typed
    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureFlowConfigLine handles empty file', async () => {
  const contents = ``;
  const root = 'fixtures/empty-newline-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureFlowConfigLine({
    dir: root,
    section: 'ignore',
    line: '.*/node_modules/fusion-cli',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[ignore]
    .*/node_modules/fusion-cli
    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureFlowConfigLine adds correct line', async () => {
  const contents = `
[ignore]
;.*/node_modules/fusion-cli
.*/node_modules/react/flow-typed

[libs]
;.*/node_modules/fusion-cli
.*/node_modules/react/flow-typed
`;
  const root = 'fixtures/add-line-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureFlowConfigLine({
    dir: root,
    section: 'ignore',
    line: '.*/node_modules/fusion-cli',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[ignore]
    .*/node_modules/fusion-cli
    ;.*/node_modules/fusion-cli
    .*/node_modules/react/flow-typed

    [libs]
    ;.*/node_modules/fusion-cli
    .*/node_modules/react/flow-typed
    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureFlowConfigLine respects if line already exists', async () => {
  const contents = `
[ignore]
.*/node_modules/fusion-cli
.*/node_modules/react/flow-typed
`;
  const root = 'fixtures/add-line-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureFlowConfigLine({
    dir: root,
    section: 'ignore',
    line: '.*/node_modules/fusion-cli',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[ignore]
    .*/node_modules/fusion-cli
    .*/node_modules/react/flow-typed
    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureMinimalFlowConfigVersion handles empty file', async () => {
  const contents = ``;
  const root = 'fixtures/empty-version-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureMinimalFlowConfigVersion({
    dir: root,
    version: '0.102.0',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[version]
    0.102.0
    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureMinimalFlowConfigVersion handles empty version', async () => {
  const contents = `
[version]

`;
  const root = 'fixtures/empty-version-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureMinimalFlowConfigVersion({
    dir: root,
    version: '0.102.0',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[version]
    0.102.0

    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureMinimalFlowConfigVersion overwrites lower version', async () => {
  const contents = `
[version]
0.98.0
`;
  const root = 'fixtures/lower-version-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureMinimalFlowConfigVersion({
    dir: root,
    version: '0.102.0',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[version]
    0.102.0
    "
  `);
  await removeFile(root);
});

test('codemod-flowconfig#ensureMinimalFlowConfigVersion leaves newer version', async () => {
  const contents = `
[version]
0.104.0
`;
  const root = 'fixtures/higher-version-flowconfig';
  const fixture = `${root}/.flowconfig`;
  await writeFile(fixture, contents);
  await ensureMinimalFlowConfigVersion({
    dir: root,
    version: '0.102.0',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "[version]
    0.104.0
    "
  `);
  await removeFile(root);
});
