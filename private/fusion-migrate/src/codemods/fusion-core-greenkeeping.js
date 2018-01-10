const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const add = require('../utils/add-package');

module.exports = compose(
  bump('fusion-core', '^0.3.0-0'),
  add('peerDependencies', 'fusion-tokens', '^0.2.0')
);
