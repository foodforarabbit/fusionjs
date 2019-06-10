// @flow
import {replaceJSInFile} from './codemod-replace-js-in-file.js';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('codemod-replace-js source found', async () => {
  const contents = `
app.register(FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replaceJSInFile({
    fileName: fixture,
    source: 'app.register(FontLoaderPlugin);',
    target: 'app.register(FontLoaderReactToken, FontLoaderPlugin);',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
"
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
  await removeFile(root);
});

test('codemod-replace-js source not found', async () => {
  const contents = `
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
`;
  const root = 'fixtures/replace-js';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await replaceJSInFile({
    fileName: fixture,
    source: 'app.register(FontLoaderPlugin);',
    target: 'app.register(FontLoaderReactToken, FontLoaderPlugin);',
  });
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
"
app.register(FontLoaderReactToken, FontLoaderPlugin);
app.register(FontLoaderReactConfigToken, fontConfig);
"
`);
  await removeFile(root);
});
