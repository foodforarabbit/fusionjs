const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const add = require('../utils/add-package');

module.exports = compose(
  bump('fusion-core', '0.3.5'),
  bump('fusion-cli', '0.3.2'),
  bump('fusion-react', '0.4.3'),
  bump('fusion-react-async', '0.2.0'),
  bump('fusion-test-utils', '0.4.2'),
  add('fusion-tokens', '^0.0.6')
);
