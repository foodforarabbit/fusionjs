import {createPlugin} from 'fusion-core';
import {ProxyConfigToken, getMatchFn} from './plugin.js';

export default decide => {
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
