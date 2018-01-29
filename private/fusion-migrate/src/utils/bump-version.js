const find = require('find');
const fs = require('fs');

const cache = {};

module.exports = (name, version) => ({source}) => {
  if (name && version && !cache[name]) {
    cache[name] = true;
    const files = find.fileSync(/(^(?!.*(node_modules))).*(package.json)$/, process.cwd());
    files.forEach(file => {
      const meta = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (meta) {
        if (meta.dependencies && meta.dependencies[name]) {
          meta.dependencies[name] = version;
        }
        if (meta.devDependencies && meta.devDependencies[name]) {
          meta.devDependencies[name] = version;
        }
        if (meta.peerDependencies && meta.peerDependencies[name]) {
          meta.peerDependencies[name] = version;
        }
        fs.writeFileSync(file, JSON.stringify(meta, null, 2), 'utf8');
      }
    });
  }
  return source;
};
