const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('fusion-plugin-browser-performance-emitter', '0.2.2'),
  migrate('BrowserPerformanceEmitterPlugin')
);
