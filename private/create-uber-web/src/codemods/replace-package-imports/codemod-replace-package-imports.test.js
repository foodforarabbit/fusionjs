// @flow
import {replacePackageImports} from './codemod-replace-package-imports.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-replace-package-imports switches target for replacement package', async () => {
  const contents = `
import Plugin, {Token} from "@uber/fusion-plugin-google-analytics-react";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-import-simple';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-google-analytics-react',
    replacement: '@uber/fusion-plugin-google-analytics',
    imports: ['default', 'Token'],
    dir: root,
    strategy: 'curated',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import Plugin, { Token } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports merges existing package imports', async () => {
  const contents = `
import Plugin, {Token} from "@uber/fusion-plugin-google-analytics-react";
import {OtherToken} from "@uber/fusion-plugin-google-analytics";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-import-merge';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-google-analytics-react',
    replacement: '@uber/fusion-plugin-google-analytics',
    imports: ['default', 'Token'],
    dir: root,
    strategy: 'curated',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import Plugin, { OtherToken, Token } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test("codemod-replace-package-imports doesn't affect other existing imports", async () => {
  const contents = `
import Plugin, {Token as T, withHOC} from "@uber/fusion-plugin-google-analytics-react";
import {Mock} from "@uber/fusion-plugin-google-analytics";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-import-complex';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-google-analytics-react',
    replacement: '@uber/fusion-plugin-google-analytics',
    imports: ['default', 'Token'],
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import { withHOC } from \\"@uber/fusion-plugin-google-analytics-react\\";
    import Plugin, { Mock, Token as T } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports ignores gracefully', async () => {
  const contents = `
import {Token, withHOC} from "@uber/fusion-plugin-google-analytics-react";
import {Mock} from "@uber/fusion-plugin-google-analytics";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-import-noop';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-google-analytics-react',
    replacement: '@uber/fusion-plugin-google-analytics',
    imports: ['default'],
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import {Token, withHOC} from \\"@uber/fusion-plugin-google-analytics-react\\";
    import {Mock} from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports handles basic named type import', async () => {
  const contents = `
import type { M3Type } from '@uber/fusion-plugin-m3-react';
`;
  const root = 'fixtures/replace-type-import-basic';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-m3-react',
    replacement: '@uber/fusion-plugin-m3',
    typeImports: ['M3Type'],
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import type { M3Type } from \\"@uber/fusion-plugin-m3\\";
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports handles mixed value and type imports', async () => {
  const contents = `
import Plugin, {Token, type TokenType, type OtherTokenType} from "@uber/fusion-plugin-google-analytics-react";
import type DefaultType, {ThirdTokenType} from "@uber/fusion-plugin-google-analytics-react";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-type-imports';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-google-analytics-react',
    replacement: '@uber/fusion-plugin-google-analytics',
    imports: ['default', 'Token'],
    typeImports: ['TokenType'],
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import { type OtherTokenType } from \\"@uber/fusion-plugin-google-analytics-react\\";
    import type DefaultType, {ThirdTokenType} from \\"@uber/fusion-plugin-google-analytics-react\\";
    import Plugin, { Token } from \\"@uber/fusion-plugin-google-analytics\\";
    import type { TokenType } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports merges type imports', async () => {
  const contents = `
import type DefaultType, {TokenType} from "@uber/fusion-plugin-google-analytics-react";
import type {OtherType} from "@uber/fusion-plugin-google-analytics";
`;
  const root = 'fixtures/merge-type-imports';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    target: '@uber/fusion-plugin-google-analytics-react',
    replacement: '@uber/fusion-plugin-google-analytics',
    typeImports: ['default', 'TokenType'],
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import type DefaultType, { OtherType, TokenType } from \\"@uber/fusion-plugin-google-analytics\\";
    "
  `);
  await removeFile(root);
});
