const fs = require('fs');

const cache = {};

module.exports = (name, version) => source => {
  if (!cache[name]) {
    cache[name] = true;
    const meta = fs.readFileSync('package.json', 'utf8');
    if (meta.dependencies[name]) meta.dependencies[name] = version;
    if (meta.devDependencies[name]) meta.devDependencies[name] = version;
    if (meta.peerDependencies[name]) meta.peerDependencies[name] = version;
    fs.writeFileSync('package.json', JSON.stringify(meta, null, 2), 'utf8');
  }
  return source;
};
