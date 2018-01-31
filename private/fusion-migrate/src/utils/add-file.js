const find = require('find');
const fs = require('fs');
const path = require('path');

const cache = {};

module.exports = (file, data) => ({source}) => {
  if (!cache[file]) {
    cache[file] = true;
    const files = find
      .dirSync(/src/, process.cwd())
      .filter(f => !f.match(/node_modules/));
    files.forEach(f => {
      const meta = JSON.parse(fs.readFileSync(f + '/../package.json', 'utf-8'));
      if (!(meta.name && meta.name.match(/^fusion-|^uber\/fusion-/))) {
        fs.writeFileSync(path.resolve(f + '/../' + file), data, 'utf-8');
      }
    });
  }
  return source;
};
