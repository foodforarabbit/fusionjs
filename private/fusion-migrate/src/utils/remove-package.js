const fs = require('fs');

const cache = {};

module.exports = name => source => {
  if (!cache[name]) {
    cache[name] = true;
    const meta = fs.readFileSync('package.json', 'utf8');
    if (meta.dependencies[name]) delete meta.dependencies[name];
    if (meta.devDependencies[name]) delete meta.devDependencies[name];
    if (meta.peerDependencies[name]) delete meta.peerDependencies[name];
    fs.writeFileSync('package.json', JSON.stringify(meta, null, 2), 'utf8');
  }
  return source;
};
