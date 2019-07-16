// @flow
import {codemodBazelIgnore} from './codemod-bazelignore';
import {readFile, writeFile, removeFile} from '@dubstep/core';

test('codemod-bazelignore', async () => {
  const dir = '__codemodded_bazel_ignore__';
  const file = `${dir}/.bazelignore`;
  await writeFile(
    file,
    [
      'projects/a/node_modules',
      'projects/b/node_modules',
      'projects/c/node_modules',
    ].join('\n')
  );

  await codemodBazelIgnore({root: dir, name: 'd'});
  const modded = await readFile(file);
  expect(modded.includes('projects/d/node_modules')).toBe(true);
  await removeFile(dir);
});

test('codemod-bazelignore is idempotent', async () => {
  const dir = '__codemodded_bazel_ignore__';
  const file = `${dir}/.bazelignore`;
  await writeFile(
    file,
    [
      'projects/a/node_modules',
      'projects/b/node_modules',
      'projects/c/node_modules',
    ].join('\n')
  );

  await codemodBazelIgnore({root: dir, name: 'a'});
  const modded = await readFile(file);
  expect(modded.includes('projects/a/node_modules')).toBe(true);
  const count = (modded.match(/projects\/a\/node_modules/g) || []).length;
  expect(count).toBe(1);
  await removeFile(dir);
});
