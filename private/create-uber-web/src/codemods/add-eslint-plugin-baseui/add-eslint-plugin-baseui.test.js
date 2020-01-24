// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addESLintPluginBaseui} from './add-eslint-plugin-baseui';

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion() {
      return '^9.41.0';
    },
  };
});

test('add eslint-plugin-baseui codemod - basic', async () => {
  const root = 'fixtures/add-eslint-plugin-baseui/basic';
  const pkg = `${root}/package.json`;
  const eslintrc = `${root}/.eslintrc.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {baseui: '^9.41.0'},
    })
  );
  await writeFile(
    eslintrc,
    `module.exports = { extends: ['eslint-config-fusion'] }`
  );
  await addESLintPluginBaseui({dir: root});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(eslintrc);
  await removeFile(root);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"baseui\\": \\"^9.41.0\\"
      },
      \\"devDependencies\\": {
        \\"eslint-plugin-baseui\\": \\"^9.41.0\\"
      }
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(`
    "module.exports = {
      extends: ['eslint-config-fusion'],

      \\"rules\\": {
        \\"baseui/deprecated-theme-api\\": \\"warn\\",
        \\"baseui/deprecated-component-api\\": \\"warn\\",
        \\"baseui/no-deep-imports\\": \\"warn\\"
      },

      \\"plugins\\": [\\"baseui\\"]
    }"
  `);
});

test('add eslint-plugin-baseui codemod - ignores projects not using baseui', async () => {
  const root = 'fixtures/add-eslint-plugin-baseui/non-baseui';
  const pkg = `${root}/package.json`;
  const eslintrc = `${root}/.eslintrc.js`;
  await writeFile(pkg, JSON.stringify({dependencies: {}, devDependencies: {}}));
  await writeFile(
    eslintrc,
    `module.exports = { extends: ['eslint-config-fusion'] }`
  );
  await addESLintPluginBaseui({dir: root});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(eslintrc);
  await removeFile(root);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {},
      \\"devDependencies\\": {}
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(
    `"module.exports = { extends: ['eslint-config-fusion'] }"`
  );
});

test('add eslint-plugin-baseui codemod - existing rules and plugins', async () => {
  const root = 'fixtures/add-eslint-plugin-baseui/existing-rules-plugins';
  const pkg = `${root}/package.json`;
  const eslintrc = `${root}/.eslintrc.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {baseui: '^9.41.0'},
    })
  );
  await writeFile(
    eslintrc,
    `module.exports = { 
      extends: ['eslint-config-fusion'],
      rules: {
        'test': 'thing'
      },
      plugins: ['test']
    }`
  );
  await addESLintPluginBaseui({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(eslintrc);
  await removeFile(root);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"baseui\\": \\"^9.41.0\\"
      },
      \\"devDependencies\\": {
        \\"eslint-plugin-baseui\\": \\"^9.41.0\\"
      }
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(`
    "module.exports = { 
          extends: ['eslint-config-fusion'],
          rules: {
            'test': 'thing',
            \\"baseui/deprecated-theme-api\\": \\"warn\\",
            \\"baseui/deprecated-component-api\\": \\"warn\\",
            \\"baseui/no-deep-imports\\": \\"warn\\"
          },
          plugins: ['test', \\"baseui\\"]
        }"
  `);
});
