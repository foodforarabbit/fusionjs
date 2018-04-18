const fs = require('fs');
const path = require('path');
const util = require('util');
const ncp = util.promisify(require('ncp'));

const unlink = util.promisify(fs.unlink);

const defaultFilesToAdd = [
  'src/main.js',
  'src/app.js',
  '.eslintrc.js',
  'flow-typed',
  'src/config',
  'src/static',
  'src/plugins',
  'src/test-utils',
];
const defaultFilesToRemove = ['.eslintrc', 'gulpfile.js', 'gulpfile-dev.js'];

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
    return ncp(path.join(srcDir, fileToAdd), path.join(destDir, fileToAdd));
  });
  return Promise.all(removeFiles.concat(addFiles));
};
