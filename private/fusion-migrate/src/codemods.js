/* usage:
  npm install -g jscodeshift
  jscodeshift path-to-project/src --t path-to-this-file
*/
const fs = require('fs');
const path = require('path');
const compose = require('./utils/compose');

module.exports = function(file, api, options) {
  const root = `${__dirname}/codemods`;
  const transforms = fs
    .readdirSync(root)
    .filter(p => p.match(/js$/))
    .map(p => path.join(root, p))
    .map(require);

  return compose(...transforms)(file, api, options);
};
