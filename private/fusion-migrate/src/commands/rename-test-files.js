const fs = require('fs');
const util = require('util');
const proc = require('child_process');
const path = require('path');

const {programOf} = require('../utils/index.js');

const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);
const exec = util.promisify(proc.exec);

module.exports = async function() {
  await renameFiles('src/test').catch(() => {});
  await rename('src/test', 'src/__tests__').catch(() => {});
};

async function renameFiles(root) {
  const stats = await stat(root);
  if (stats.isDirectory()) {
    const dirs = await readDir(root);
    await Promise.all(dirs.map(dir => `${root}/${dir}`).map(renameFiles));
  } else if (stats.isFile()) {
    if (await isRedundant(root)) {
      await unlink(root);
    } else if (root.includes('util')) {
      const dir = root.replace('src/test', 'src/test-utils');
      const dirname = path.dirname(dir);
      await exec(`mkdir -p ${dirname}`);
      await rename(root, dir).catch(() => {});
    } else if (root.includes('src/test/browser')) {
      const replaced = root
        .replace(/.browser.js/, '.js')
        .replace(/\.js$/, '.browser.js');
      if (root !== replaced) await rename(root, replaced).catch(() => {});
    } else if (root.includes('src/test/node')) {
      const replaced = root
        .replace(/.node.js/, '.js')
        .replace(/\.js$/, '.node.js');
      if (root !== replaced) await rename(root, replaced).catch(() => {});
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
