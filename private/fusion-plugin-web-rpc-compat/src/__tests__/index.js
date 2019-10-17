// @noflow
import tape from 'tape-cup';
import Plugin from '../index.js';

tape('Compat plugin success', t => {
  const mockRPC = {
    from: () => {
      return {
        request: (rpcId, args) => {
          t.equal(rpcId, 'test');
          t.equal(args.hello, 'world');
          return Promise.resolve({hello: 'world'});
        },
      };
    },
  };
  const mockCreateStore = (arg1, arg2) => {
    t.equal(arg1, 'arg1');
    t.equal(arg2, 'arg2');
    return {
      dispatch: () => {
        return 5;
      },
      getState: () => {},
    };
  };
  const storeEnhancer = Plugin.provides({RPC: mockRPC});
  const store = storeEnhancer(mockCreateStore)('arg1', 'arg2');
  t.equal(store.dispatch('test'), 5, 'passes non-functions through');
  t.equal(
    store.dispatch((dispatch, getState, {rpc}) => {
      t.equal(dispatch('test'), 5, 'can dispatch from thunks');
      t.equal(dispatch(() => 20), 20, 'can dispatch thunks from thunks');
      t.equal(typeof getState, 'function', 'passes getState function');
      t.equal(typeof rpc, 'function', 'passes rpc extra argument');
      rpc('test', {hello: 'world'}, (err, result) => {
        t.equal(err, null);
        t.equal(result.hello, 'world');
        t.end();
      });
      return 10;
    }),
    10,
    'returns the return value of a dispatched function'
  );
});

tape('Compat plugin failures', t => {
  const mockRPC = {
    from: () => {
      return {
        request: (rpcId, args) => {
          t.equal(rpcId, 'test');
          t.equal(args.hello, 'world');
          return Promise.reject({hello: 'world'});
        },
      };
    },
  };
  const mockCreateStore = (arg1, arg2) => {
    t.equal(arg1, 'arg1');
    t.equal(arg2, 'arg2');
    return {
      dispatch: () => {
        return 5;
      },
      getState: () => {},
    };
  };
  const storeEnhancer = Plugin.provides({RPC: mockRPC});
  const store = storeEnhancer(mockCreateStore)('arg1', 'arg2');
  t.equal(store.dispatch('test'), 5, 'passes non-functions through');
  t.equal(
    store.dispatch((dispatch, getState, {rpc}) => {
      t.equal(dispatch('test'), 5, 'can dispatch from thunks');
      t.equal(dispatch(() => 20), 20, 'can dispatch thunks from thunks');
      t.equal(typeof getState, 'function', 'passes getState function');
      t.equal(typeof rpc, 'function', 'passes rpc extra argument');
      rpc('test', {hello: 'world'}, (err, result) => {
        t.equal(err.hello, 'world');
        t.equal(result.hello, 'world');
        t.end();
      });
      return 10;
    }),
    10,
    'returns the return value of a dispatched function'
  );
});

if (__NODE__) {
  tape('Compat plugin error in callback', t => {
    const mockRPC = {
      from: () => {
        return {
          request: (rpcId, args) => {
            return Promise.resolve({hello: 'world'});
          },
        };
      },
    };
    const mockCreateStore = (arg1, arg2) => {
      return {
        dispatch: () => {
          return 5;
        },
        getState: () => {},
      };
    };
    process.once('uncaughtException', e => {
      t.equal(e.message, 'fail');
      t.end();
    });
    const storeEnhancer = Plugin.provides({RPC: mockRPC});
    const store = storeEnhancer(mockCreateStore)('arg1', 'arg2');
    store.dispatch((dispatch, getState, {rpc}) => {
      rpc('test', {hello: 'world'}, (err, result) => {
        throw new Error('fail');
      });
    });
  });
}
