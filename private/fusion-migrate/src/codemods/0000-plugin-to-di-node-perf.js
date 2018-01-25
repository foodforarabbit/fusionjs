const compose = require('../utils/compose');
const bump = require('../utils/bump');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('fusion-plugin-node-performance-emitter', '0.2.0'),
  migrate('NodePerfEmitterPlugin')
);
