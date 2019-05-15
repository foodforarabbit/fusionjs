const fs = require('fs');
const path = require('path');
const util = require('util');
const ncp = util.promisify(require('ncp'));

const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

const defaultFilesToAdd = [
  'src/main.js',
  'src/app.js',
  '.eslintrc.js',
  '.flowconfig',
  'flow-typed',
  'src/config',
  'src/static',
  'src/plugins',
  'src/test-utils',
  'src/plugins/get-initial-state.js',
];
const defaultFilesToRemove = [
  '.babelrc',
  '.eslintrc',
  'gulpfile.js',
  'gulpfile-dev.js',
  'server.js',
];

const initialStatePlugin = fs
  .readFileSync(path.join(__dirname, './initial-state-plugin.txt'))
  .toString();

module.exports = async function updateFiles({
  remove = defaultFilesToRemove,
  add = defaultFilesToAdd,
  srcDir,
  destDir,
}) {
  const removeFiles = remove
    .map(r => path.join(destDir, r))
    .map(async r => {
      return unlink(r).catch(e => {
        if (e.code !== 'ENOENT') {
          throw e;
        }
      });
    });
  const addFiles = add
    .filter(f => f !== 'src/plugins/get-initial-state.js')
    .map(fileToAdd => {
      const srcAddPath = path.join(srcDir, fileToAdd);
      const destAddPath = path.join(destDir, fileToAdd);
      return ncp(srcAddPath, destAddPath);
    });

  await Promise.all([...removeFiles, ...addFiles]);
  if (add.includes('src/plugins/get-initial-state.js')) {
    await writeFile(
      path.join(destDir, 'src/plugins/get-initial-state.js'),
      initialStatePlugin
    );
  }
};
