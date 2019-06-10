// @flow
import {codemodFusionPluginFontLoaderReact} from './codemod-fusion-plugin-font-loader-react';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-fusion-plugin-font-loader-react no import, matching register', async () => {
  const contents = `
app.register(FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await codemodFusionPluginFontLoaderReact({
    fileName: fixture,
  });
  const newContents = await readFile(fixture);
  const data = newContents;
  await removeFile(root);
  expect(data).toMatchInlineSnapshot(`
"
import {FontLoaderReactToken} from 'fusion-plugin-font-loader-react';
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
});

test('codemod-fusion-plugin-font-loader-react existing some imports from package import, matching register', async () => {
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
    fileName: fixture,
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
    fileName: fixture,
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
