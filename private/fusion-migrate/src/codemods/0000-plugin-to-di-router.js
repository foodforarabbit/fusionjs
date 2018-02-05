const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('fusion-plugin-react-router', '0.4.3'),
  migrate('Router')
);
