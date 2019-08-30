// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {addESLintPluginGraphQL} from './add-eslint-plugin-graphql';

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion() {
      return '^2.0.0';
    },
  };
});

test('add eslint plugin graphql codemod', async () => {
  const root = 'fixtures/add-eslint-plugin-base';
  const pkg = `${root}/package.json`;
  const eslintrc = `${root}/.eslintrc.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {graphql: '14.4.2'},
      scripts: {
        'validate-queries': 'gql validate-queries',
        'posttest-integration': 'yarn validate-queries && yarn something',
      },
    })
  );
  await writeFile(
    eslintrc,
    `module.exports = { extends: ['eslint-config-fusion'] }`
  );
  await addESLintPluginGraphQL({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(eslintrc);
  await removeFile(root);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"graphql\\": \\"14.4.2\\",
        \\"eslint-plugin-graphql\\": \\"^2.0.0\\"
      },
      \\"scripts\\": {
        \\"posttest-integration\\": \\"yarn something\\"
      },
      \\"devDependencies\\": {}
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(`
    "module.exports = {
      extends: ['eslint-config-fusion'],

      \\"rules\\": {
        \\"graphql/template-strings\\": [\\"error\\", {
          \\"env\\": \\"apollo\\",
          \\"schemaJson\\": require(\\"./.graphql/schema.json\\")
        }]
      },

      \\"plugins\\": [\\"graphql\\"]
    }"
  `);
});

test('add eslint plugin graphql codemod ignores non-graphql projects', async () => {
  const root = 'fixtures/add-eslint-plugin-non-graphql';
  const pkg = `${root}/package.json`;
  const eslintrc = `${root}/.eslintrc.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {},
      scripts: {
        'validate-queries': 'gql validate-queries',
        'posttest-integration': 'yarn validate-queries && yarn something',
      },
    })
  );
  await writeFile(
    eslintrc,
    `module.exports = { extends: ['eslint-config-fusion'] }`
  );
  await addESLintPluginGraphQL({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(eslintrc);
  await removeFile(root);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {},
      \\"scripts\\": {
        \\"validate-queries\\": \\"gql validate-queries\\",
        \\"posttest-integration\\": \\"yarn validate-queries && yarn something\\"
      },
      \\"devDependencies\\": {}
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(
    `"module.exports = { extends: ['eslint-config-fusion'] }"`
  );
});

test('add eslint plugin graphql codemod - existing rules and plugins', async () => {
  const root = 'fixtures/add-eslint-plugin-base';
  const pkg = `${root}/package.json`;
  const eslintrc = `${root}/.eslintrc.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {graphql: '14.4.2'},
    })
  );
  await writeFile(
    eslintrc,
    `module.exports = { 
      extends: ['eslint-config-fusion'],
      rules: {
        'test': 'thing',
      },
      plugins: ['test']
    }`
  );
  await addESLintPluginGraphQL({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(eslintrc);
  await removeFile(root);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"graphql\\": \\"14.4.2\\",
        \\"eslint-plugin-graphql\\": \\"^2.0.0\\"
      },
      \\"devDependencies\\": {},
      \\"scripts\\": {}
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(`
    "module.exports = { 
          extends: ['eslint-config-fusion'],
          rules: {
            'test': 'thing',

            \\"graphql/template-strings\\": [\\"error\\", {
              \\"env\\": \\"apollo\\",
              \\"schemaJson\\": require(\\"./.graphql/schema.json\\")
            }]
          },
          plugins: ['test', \\"graphql\\"]
        }"
  `);
});
