// @flow
import {codemodFusionPluginFontLoaderReact} from './codemod-fusion-plugin-font-loader-react';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-fusion-plugin-font-loader-react ignores files without import', async () => {
  const contents = `
app.register(FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginFontLoaderReact({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
app.register(FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
});

test('codemod-fusion-plugin-font-loader-react ignores files without register call', async () => {
  const contents = `
import FontLoaderPlugin, { FontLoaderReactConfigToken } from 'fusion-plugin-font-loader-react';
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginFontLoaderReact({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import FontLoaderPlugin, { FontLoaderReactConfigToken } from 'fusion-plugin-font-loader-react';
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
});

test('codemod-fusion-plugin-font-loader-react adds to existing imports from package, adds token to register call', async () => {
  const contents = `
import FontLoaderPlugin, {
  FontLoaderReactConfigToken,
} from 'fusion-plugin-font-loader-react';
app.register(FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginFontLoaderReact({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import FontLoaderPlugin, { FontLoaderReactConfigToken, FontLoaderReactToken } from 'fusion-plugin-font-loader-react';
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
});

test('codemod-fusion-plugin-font-loader-react import and register already up to date', async () => {
  const contents = `
import FontLoaderPlugin, { FontLoaderReactConfigToken, FontLoaderReactToken } from 'fusion-plugin-font-loader-react';
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginFontLoaderReact({
    dir: root,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import FontLoaderPlugin, { FontLoaderReactConfigToken, FontLoaderReactToken } from 'fusion-plugin-font-loader-react';
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
});
