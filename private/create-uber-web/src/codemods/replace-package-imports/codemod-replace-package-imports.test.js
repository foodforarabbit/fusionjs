// @flow
import {replacePackageImports} from './codemod-replace-package-imports.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-replace-package-imports switches target for replacement package', async () => {
  const contents = `
import Plugin, {GoogleAnalyticsToken} from "@uber/fusion-plugin-google-analytics-react";
app.register(GoogleAnalyticsToken, Plugin);
`;
  const root = 'fixtures/replace-import-simple';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    dir: root,
    strategy: 'curated',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import Plugin, { GoogleAnalyticsToken } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(GoogleAnalyticsToken, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports merges existing package imports', async () => {
  const contents = `
import Plugin, {GoogleAnalyticsToken} from "@uber/fusion-plugin-google-analytics-react";
import {OtherToken} from "@uber/fusion-plugin-google-analytics";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-import-merge';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    dir: root,
    strategy: 'curated',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import Plugin, { OtherToken, GoogleAnalyticsToken } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test("codemod-replace-package-imports doesn't affect other existing imports", async () => {
  const contents = `
import Plugin, {GoogleAnalyticsToken as T, withHOC} from "@uber/fusion-plugin-google-analytics-react";
import {Mock} from "@uber/fusion-plugin-google-analytics";
app.register(T, Plugin);
`;
  const root = 'fixtures/replace-import-complex';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import { withHOC } from \\"@uber/fusion-plugin-google-analytics-react\\";
    import Plugin, { Mock, GoogleAnalyticsToken as T } from \\"@uber/fusion-plugin-google-analytics\\";
    app.register(T, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports ignores gracefully', async () => {
  const contents = `
import {OtherToken, withHOC} from "@uber/fusion-plugin-google-analytics-react";
import {Mock} from "@uber/fusion-plugin-google-analytics";
`;
  const root = 'fixtures/replace-import-noop';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import {OtherToken, withHOC} from \\"@uber/fusion-plugin-google-analytics-react\\";
    import {Mock} from \\"@uber/fusion-plugin-google-analytics\\";
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
import Plugin, {M3Token, type M3Type, type OtherTokenType} from "@uber/fusion-plugin-m3-react";
import type DefaultType, {ThirdTokenType} from "@uber/fusion-plugin-google-analytics-react";
app.register(Token, Plugin);
`;
  const root = 'fixtures/replace-type-imports';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import { type OtherTokenType } from \\"@uber/fusion-plugin-m3-react\\";
    import type DefaultType, {ThirdTokenType} from \\"@uber/fusion-plugin-google-analytics-react\\";
    import Plugin, { M3Token } from \\"@uber/fusion-plugin-m3\\";
    import type { M3Type } from \\"@uber/fusion-plugin-m3\\";
    app.register(Token, Plugin);
    "
  `);
  await removeFile(root);
});

test('codemod-replace-package-imports merges type imports', async () => {
  const contents = `
import type {M3Type} from "@uber/fusion-plugin-m3-react";
import type {OtherType} from "@uber/fusion-plugin-m3";
`;
  const root = 'fixtures/merge-type-imports';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replacePackageImports({
    strategy: 'curated',
    dir: root,
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
    import type { OtherType, M3Type } from \\"@uber/fusion-plugin-m3\\";
    "
  `);
  await removeFile(root);
});
