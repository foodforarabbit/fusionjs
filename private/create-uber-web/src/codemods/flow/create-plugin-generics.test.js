// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addCreatePluginGenerics} from './create-plugin-generics.js';

test('addCreatePluginGenerics', async () => {
  const root = 'fixtures/create-plugin-generics';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, 'createPlugin({})');
  await addCreatePluginGenerics({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('createPlugin<*, *>(')).toBe(true);
});

test('addCreatePluginGenerics, ignore existing', async () => {
  const root = 'fixtures/create-plugin-generics-existing';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, 'createPlugin<Foo>({})');
  await addCreatePluginGenerics({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('createPlugin<Foo>(')).toBe(true);
});

test('addCreatePluginGenerics, ignore @noflow files', async () => {
  const root = 'fixtures/create-plugin-generics-existing';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(
    file,
    `// @noflow
    createPlugin({})`
  );
  await addCreatePluginGenerics({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('createPlugin(')).toBe(true);
});
