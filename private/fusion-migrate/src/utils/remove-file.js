const find = require('find');
const fs = require('fs');

const cache = {};

module.exports = file => ({source}) => {
  if (!cache[file]) {
    cache[file] = true;
    const files = find
      .fileSync(new RegExp(file), process.cwd())
      .filter(f => !f.match(/node_modules/));
    files.forEach(f => fs.unlinkSync(f));
  }
};
