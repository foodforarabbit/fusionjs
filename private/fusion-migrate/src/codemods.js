const fs = require('fs');
const path = require('path');
const compose = require('./utils/compose');

module.exports = function(file, api, options) {
  const root = `${__dirname}/codemods`;
  const transforms = fs
    .readdirSync(root)
    .filter(p => p.match(/js$/))
    .map(p => path.join(root, p))
    .sort((a, b) => a.localeCompare(b))
    .map(require);

  return compose(...transforms)(file, api, options);
};
