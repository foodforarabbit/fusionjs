const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('@uber/fusion-plugin-events-adapter', '0.3.2'),
  migrate('EventsAdapterPlugin')
);
