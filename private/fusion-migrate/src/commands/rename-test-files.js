const fs = require('fs');
const util = require('util');
const {move} = require('fs-extra');
const path = require('path');
const {findFiles, withTextFile} = require('@dubstep/core');

const {programOf} = require('../utils/index.js');

const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);

module.exports = async function() {
  await unlink('dist-test/').catch(() => {});
  await move('src/test/node', 'src/__tests__/node').catch(() => {});
  await move('src/test/browser', 'src/__tests__/browser').catch(e => {});
  await moveNonTestFiles();
  await move('src/test-utils/e2e', 'src/test/e2e').catch(e => {});
  await renameFiles('src/__tests__');
  await removeRedundantFiles();
  await updateGulpfile();
};

function updateGulpfile() {
  return withTextFile('gulpfile.js', contents => {
    return `${contents}
// disabling bedrock test build on watch
gulp.task('watch:test-client', () => {});
gulp.task('watch:test-server', () => {});
gulp.task('watch:test-json', () => {}); 
`;
  });
}

async function moveNonTestFiles() {
  const files = await findFiles('src/__tests__/**/*.js');
  await Promise.all(
    files.map(async f => {
      const contents = await readFile(f);
      if (
        !contents.includes('test(') &&
        !contents.includes('describe(') &&
        !contents.includes('it(')
      ) {
        await move(f, path.join('src/test-utils', f.split('__tests__')[1]));
      }
    })
  );
}

async function removeRedundantFiles() {
  let files = await findFiles(`src/__tests__/**/*.js`);
  files = files.concat(await findFiles(`src/test-utils/**/*.js`));
  await Promise.all(
    files.map(async f => {
      if (await isRedundant(f)) {
        await unlink(f);
      }
    })
  );
}

async function renameFiles(root) {
  const stats = await stat(root);
  if (stats.isDirectory()) {
    const dirs = await readDir(root);
    await Promise.all(dirs.map(dir => `${root}/${dir}`).map(renameFiles));
  } else if (stats.isFile()) {
    if (root.includes('src/__tests__/browser')) {
      const replaced = root
        .replace(/.browser.js/, '.js')
        .replace(/\.js$/, '.browser.js');
      if (root !== replaced) await rename(root, replaced);
    } else if (root.includes('src/__tests__/node')) {
      const replaced = root
        .replace(/.node.js/, '.js')
        .replace(/\.js$/, '.node.js');
      if (root !== replaced) await rename(root, replaced);
    }
  }
}

async function isRedundant(path) {
  if (!path.endsWith('.js')) return false;
  const data = await readFile(path, 'utf-8');
  const program = programOf(data);
  if (data.match(/'require-dir'/)) return true;
  const lastImport = program.body
    .map(node => node.type)
    .lastIndexOf('ImportDeclaration');
  if (lastImport > -1 && lastImport === program.body.length - 1) return true;
  return false;
}
