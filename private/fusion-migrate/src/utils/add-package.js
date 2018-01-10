const fs = require('fs');

const cache = {};

module.exports = (depType, name, version) => source => {
  if (!cache[name]) {
    cache[name] = true;
    const meta = fs.readFileSync('package.json', 'utf8');
    if (meta[depType][name]) meta[depType][name] = version;
    fs.writeFileSync('package.json', JSON.stringify(meta, null, 2), 'utf8');
  }
  return source;
};
