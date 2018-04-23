import {match} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import uberStoreEnhancer from '@uber/redux-store';
import getRoutes from './components/routes';
import rootReducer from './reducers/index';

export default function createAppStore(initialState) {
  const middleware = [];
  const enhancers = [
    applyMiddleware(...middleware),
    uberStoreEnhancer(getRoutes(), match),
  ];

  const store = createStore(rootReducer, initialState, compose(...enhancers));

  /* istanbul ignore next */
  if (module.onReload) {
    module.onReload(() => {
      const nextReducer = require('./reducers/index');
      store.replaceReducer(nextReducer.default || nextReducer);
      // return true to indicate that this module is accepted and
      // there is no need to reload its parent modules
      return true;
    });
  }
  return store;
}
