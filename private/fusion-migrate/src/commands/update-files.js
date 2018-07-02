const fs = require('fs');
const path = require('path');
const util = require('util');
const ncp = util.promisify(require('ncp'));

const unlink = util.promisify(fs.unlink);

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
];
const defaultFilesToRemove = [
  '.babelrc',
  '.eslintrc',
  'gulpfile.js',
  'gulpfile-dev.js',
  'server.js',
];

module.exports = async function updateFiles({
  remove = defaultFilesToRemove,
  add = defaultFilesToAdd,
  srcDir,
  destDir,
}) {
  const removeFiles = remove.map(r => path.join(destDir, r)).map(async r => {
    return unlink(r).catch(e => {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    });
  });
  const addFiles = add.map(fileToAdd => {
    let destAddPath = path.join(destDir, fileToAdd);
    const srcAddPath = path.join(srcDir, fileToAdd);
    if (fs.existsSync(destAddPath)) {
      destAddPath = path.join(destDir, `${fileToAdd}-new`);
    }
    return ncp(srcAddPath, destAddPath);
  });
  return Promise.all([...removeFiles, ...addFiles]);
};
