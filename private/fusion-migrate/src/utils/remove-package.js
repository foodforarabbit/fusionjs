const find = require('find');
const lockfile = require('lockfile');
const fs = require('fs');

const cache = {};

module.exports = name => ({source}) => {
  if (!cache[name]) {
    cache[name] = true;
    const files = find.fileSync(/package\.json/, process.cwd());
    files.forEach(file => {
      const meta = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (meta.dependencies && meta.dependencies[name]) {
        delete meta.dependencies[name];
      }
      if (meta.devDependencies && meta.devDependencies[name]) {
        delete meta.devDependencies[name];
      }
      if (meta.peerDependencies && meta.peerDependencies[name]) {
        delete meta.peerDependencies[name];
      }
      lockfile.lockSync(file);
      fs.writeFileSync(file, JSON.stringify(meta, null, 2), 'utf8');
      lockfile.unlockSync(file);
    });
  }
  return source;
};
