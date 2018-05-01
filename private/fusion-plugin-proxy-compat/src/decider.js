const {createPlugin} = require('fusion-core');
const {getMatchFn} = require('./plugin.js');
const {ProxyConfigToken} = require('./tokens.js');

module.exports = decide => {
  return createPlugin({
    deps: {
      config: ProxyConfigToken,
    },
    provides: ({config}) => {
      const matchFn = getMatchFn(config);
      return ctx => {
        return decide(ctx) && !matchFn(ctx);
      };
    },
  });
};
