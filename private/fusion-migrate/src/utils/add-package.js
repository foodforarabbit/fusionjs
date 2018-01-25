const find = require('find');
const fs = require('fs');

const cache = {};

module.exports = (depType, name, version) => ({source}) => {
  if (!cache[name]) {
    cache[name] = true;
    const files = find.fileSync(/package\.json/, process.cwd());
    files.forEach(file => {
      const meta = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (!meta[depType]) meta[depType] = {};
      meta[depType][name] = version;
      fs.writeFileSync(file, JSON.stringify(meta, null, 2), 'utf8');
    });
  }
  return source;
};
