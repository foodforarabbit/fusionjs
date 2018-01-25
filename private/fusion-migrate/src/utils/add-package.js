const find = require('find');
const fs = require('fs');

const cache = {};

module.exports = (name, version) => ({source}) => {
  if (!cache[name]) {
    cache[name] = true;
    const files = find.fileSync(/package\.json/, process.cwd());
    files.forEach(file => {
      const meta = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (meta.name && meta.name.match(/^fusion-|^uber\/fusion-/)) {
        if (!meta.devDependencies) meta.devDependencies = {};
        meta.devDependencies[name] = version;
        if (!meta.peerDependencies) meta.peerDependencies = {};
        meta.peerDependencies[name] = version;
      } else {
        if (!meta.dependencies) meta.dependencies = {};
        meta.dependencies[name] = version;
      }
      fs.writeFileSync(file, JSON.stringify(meta, null, 2), 'utf8');
    });
  }
  return source;
};
