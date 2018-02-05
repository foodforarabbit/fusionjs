const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('fusion-plugin-node-performance-emitter', '0.3.4'),
  migrate('NodePerfEmitterPlugin')
);
