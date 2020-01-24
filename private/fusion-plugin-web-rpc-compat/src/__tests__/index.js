// @noflow
import Plugin from '../index.js';

test('Compat plugin success', done => {
  const mockRPC = {
    from: () => {
      return {
        request: (rpcId, args) => {
          expect(rpcId).toBe('test');
          expect(args.hello).toBe('world');
          return Promise.resolve({hello: 'world'});
        },
      };
    },
  };
  const mockCreateStore = (arg1, arg2) => {
    expect(arg1).toBe('arg1');
    expect(arg2).toBe('arg2');
    return {
      dispatch: () => {
        return 5;
      },
      getState: () => {},
    };
  };
  const storeEnhancer = Plugin.provides({RPC: mockRPC});
  const store = storeEnhancer(mockCreateStore)('arg1', 'arg2');
  expect(store.dispatch('test')).toBe(5);
  expect(
    store.dispatch((dispatch, getState, {rpc}) => {
      expect(dispatch('test')).toBe(5);
      expect(dispatch(() => 20)).toBe(20);
      expect(typeof getState).toBe('function');
      expect(typeof rpc).toBe('function');
      rpc('test', {hello: 'world'}, (err, result) => {
        expect(err).toBe(null);
        expect(result.hello).toBe('world');
        done();
      });
      return 10;
    })
  ).toBe(10);
});

test('Compat plugin failures', done => {
  const mockRPC = {
    from: () => {
      return {
        request: (rpcId, args) => {
          expect(rpcId).toBe('test');
          expect(args.hello).toBe('world');
          return Promise.reject({hello: 'world'});
        },
      };
    },
  };
  const mockCreateStore = (arg1, arg2) => {
    expect(arg1).toBe('arg1');
    expect(arg2).toBe('arg2');
    return {
      dispatch: () => {
        return 5;
      },
      getState: () => {},
    };
  };
  const storeEnhancer = Plugin.provides({RPC: mockRPC});
  const store = storeEnhancer(mockCreateStore)('arg1', 'arg2');
  expect(store.dispatch('test')).toBe(5);
  expect(
    store.dispatch((dispatch, getState, {rpc}) => {
      expect(dispatch('test')).toBe(5);
      expect(dispatch(() => 20)).toBe(20);
      expect(typeof getState).toBe('function');
      expect(typeof rpc).toBe('function');
      rpc('test', {hello: 'world'}, (err, result) => {
        expect(err.error.hello).toBe('world');
        expect(result.error.hello).toBe('world');
        done();
      });
      return 10;
    })
  ).toBe(10);
});

if (__NODE__) {
  // It seems uncaughtException handlers don't work in Jest
  test.skip('Compat plugin error in callback', done => {
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
      expect(e.message).toBe('fail');
      done();
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
