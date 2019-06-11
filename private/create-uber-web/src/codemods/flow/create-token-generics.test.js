// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addCreateTokenGenerics} from './create-token-generics.js';

test('addCreateTokenGenerics', async () => {
  const root = 'fixtures/create-token-generics';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, 'createToken("")');
  await addCreateTokenGenerics({dir: root});
  const data = await readFile(file);
  await removeFile(root);
  expect(data.includes('createToken<*>(')).toBe(true);
});

test('addCreateTokenGenerics, ignore existing', async () => {
  const root = 'fixtures/create-token-generics';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(file, 'createToken<Foo>("")');
  await addCreateTokenGenerics({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('createToken<Foo>(')).toBe(true);
});

test('addCreateTokenGenerics, ignore @noflow files', async () => {
  const root = 'fixtures/create-token-generics';
  const file = `${root}/src/plugins/my-plugin.js`;
  await writeFile(
    file,
    `// @noflow
    createToken({})`
  );
  await addCreateTokenGenerics({dir: root});
  const data = await readFile(file);
  await removeFile(root);

  expect(data.includes('createToken(')).toBe(true);
});
