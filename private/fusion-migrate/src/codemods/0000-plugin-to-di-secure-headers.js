const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('@uber/fusion-plugin-secure-headers', '2.0.0'),
  migrate('SecureHeaders')
);
