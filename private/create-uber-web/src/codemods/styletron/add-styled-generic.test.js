// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addStyledGeneric} from './add-styled-generic.js';

test('addStyledGeneric', async () => {
  const root = 'fixtures/add-styled-generic';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, `// @flow\nstyled('div', (props: Props) => ({}))`);
  await addStyledGeneric({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('styled<Props>(')).toBe(true);
});

test('addStyledGeneric untyped arg', async () => {
  const root = 'fixtures/add-styled-generic-untyped-arg';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, `// @flow\nstyled('div', (props) => ({}))`);
  await addStyledGeneric({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('styled<any>(')).toBe(true);
});

test('addStyledGeneric with component', async () => {
  const root = 'fixtures/add-styled-generic-with-component';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, `// @flow\nstyled(Foo, (props: any) => ({}))`);
  await addStyledGeneric({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('styled<any, any>(')).toBe(true);
});

test('addStyledGeneric, no flow', async () => {
  const root = 'fixtures/add-styled-generic';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, `// @noflow\nstyled('div', (props: Props) => ({}))`);
  await addStyledGeneric({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('styled(')).toBe(true);
});
