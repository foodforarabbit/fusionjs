// @flow
import {createPlugin} from 'fusion-core';
import {RPCToken} from 'fusion-plugin-rpc';

export default createPlugin({
  deps: {
    RPC: RPCToken,
  },
  provides({RPC}) {
    return createStore => (...args) => {
      const store = createStore(...args);
      const baseRPC = RPC.from(store.ctx);
      function rpc(rpcId, args, cb) {
        return baseRPC
          .request(rpcId, args)
          .then(result => cb(null, result))
          .catch(e => cb(e, e));
      }
      function dispatch(action) {
        if (typeof action === 'function') {
          return action(dispatch, store.getState, {rpc});
        }
        return store.dispatch(action);
      }
      return {
        ...store,
        dispatch,
      };
    };
  },
});
