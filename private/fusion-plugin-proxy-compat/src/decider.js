// @flow
/* eslint-env node */
const {createPlugin} = require('fusion-core');
/*::
import type {FusionPlugin, Token} from 'fusion-core';
*/

// $FlowFixMe
const {getMatchFn} = require('./plugin.js');
const {ProxyConfigToken} = require('./tokens.js');

module.exports = (
  decide /*: any */
) /*: FusionPlugin<{|config: typeof ProxyConfigToken|}, (ctx: empty) => any> */ => {
  return createPlugin({
    deps: {config: ProxyConfigToken},

    provides: ({config}) /*: ((ctx: empty) => any) */ => {
      const matchFn = getMatchFn(config);
      return (ctx) /*: any */ => {
        return decide(ctx) && !matchFn(ctx);
      };
    },
  });
};
