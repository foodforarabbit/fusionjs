const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const add = require('../utils/add-package');

module.exports = compose(
  bump('fusion-core', '0.3.0-5'),
  bump('fusion-react', '0.4.1'),
  bump('fusion-test-utils', '0.4.1'),
  add('devDependencies', 'fusion-tokens', '^0.0.5'),
  add('peerDependencies', 'fusion-tokens', '^0.0.5')
);
