// @flow
import App, {createPlugin, createToken} from 'fusion-core';
import {createStore} from 'redux';
import {getSimulator} from 'fusion-test-utils';

import {UberWebAnalyticsToken} from '../tokens';
import createWebAnalyticsReduxEnhancer from '../enhancer';

const EnhancerToken = createToken('EnhancerToken');

test('Web Analytics Redux enhancer', async () => {
  let store: any = null;

  const INIT_REDUX_STATE = {foo: 555};
  const FIXTURE_ACTION = {type: 'SET_FOO', payload: {foo: 123}};
  const FIXTURE_REDUCER = (state, action) =>
    action ? {...action.payload} : {};

  const app = new App('TestEl', el => el);
  app.register(UberWebAnalyticsToken, {
    createDestinations: () => {},
    eventContext: {
      setReduxState: state => {
        expect(state).toEqual(FIXTURE_ACTION.payload);
      },
    },
    track: (type, payload) => {
      expect(type).toEqual(FIXTURE_ACTION.type);
      expect(payload).toEqual(FIXTURE_ACTION);
    },
  });
  app.register(EnhancerToken, createWebAnalyticsReduxEnhancer());
  getSimulator(
    app,
    createPlugin({
      deps: {
        enhancer: EnhancerToken,
      },
      provides: ({enhancer}) => {
        store = createStore(FIXTURE_REDUCER, INIT_REDUX_STATE, enhancer);
      },
    })
  );

  store.dispatch(FIXTURE_ACTION);
});
