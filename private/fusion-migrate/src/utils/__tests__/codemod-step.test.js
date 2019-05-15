// TODO: unskip tests. Skipping now because there are issues with running git commands on CI
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tmp = require('tmp');
const {promisify} = require('util');
const ncp = promisify(require('ncp'));

const codemodStep = require('../codemod-step.js');

const originalFixtureDir = path.join(
  __dirname,
  '../../__fixtures__/codemod-step-fixture/'
);

const simpleCodemod = babel => {
  const t = babel.types;
  return {
    visitor: {
      ImportDeclaration(path) {
        const sourceName = path.get('source').node.value;
        if (sourceName !== 'replaced') {
          path.replaceWith(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('replaced'))],
              t.stringLiteral('replaced')
            )
          );
        }
      },
    },
  };
};

test.skip('codemod-step', async () => {
  const destDir = tmp.dirSync().name;
  await ncp(originalFixtureDir, destDir);
  await execa.shell(`git init && git add .`, {cwd: destDir});
  const matchedFiles = await codemodStep({
    destDir,
    plugin: simpleCodemod,
  });
  matchedFiles
    .map(f => path.join(destDir, f))
    .forEach(f => {
      expect(fs.readFileSync(f).toString()).toMatchSnapshot();
    });
});

test.skip('codemod-step-filter', async () => {
  const destDir = tmp.dirSync().name;
  await ncp(originalFixtureDir, destDir);
  await execa.shell(`git init && git add .`, {cwd: destDir});
  const matchedFiles = await codemodStep({
    destDir,
    filter: f => f.endsWith('main.js'),
    plugin: simpleCodemod,
  });

  assert.equal(matchedFiles.length, 1);

  matchedFiles
    .map(f => path.join(destDir, f))
    .forEach(f => {
      expect(fs.readFileSync(f).toString()).toMatchSnapshot();
    });
});
