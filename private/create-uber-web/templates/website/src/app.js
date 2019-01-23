// @flow
import type FusionApp from 'fusion-core';
import {createPlugin} from 'fusion-core';

import ActionEmitterEnhancerPlugin from 'fusion-plugin-redux-action-emitter-enhancer';
import {compose} from 'redux';
import ReactReduxPlugin, {
  ReduxToken,
  ReducerToken,
  EnhancerToken,
} from 'fusion-plugin-react-redux';
import reduxOptions from './redux.js';
import HealthPlugin from './plugins/health.js';

export default (app: FusionApp) => {
  if (__NODE__) {
    // node-specific plugins
    app.middleware(HealthPlugin);
  } else {
    // browser-specific plugins

    // Handle redux hot reloading for redux.
    __DEV__ &&
      app.enhance(ReduxToken, redux => {
        return createPlugin<*, *>({
          provides() {
            return redux;
          },
          middleware: () => {
            return (ctx, next) => {
              /* global module */
              if (module.hot) {
                module.hot.accept('./redux', () => {
                  // eslint-disable-next-line cup/no-undef
                  const nextReducer = require('./redux').default.reducer;
                  redux.from(ctx).store.replaceReducer(nextReducer);
                });
              }
              return next();
            };
          },
        });
      });
  }

  // universal plugins
  app.register(ReduxToken, ReactReduxPlugin);
  app.register(ReducerToken, reduxOptions.reducer);
  app.register(EnhancerToken, ActionEmitterEnhancerPlugin);
  if (reduxOptions.enhancer) {
    app.enhance(EnhancerToken, prevEnhancer => {
      return compose(
        prevEnhancer,
        reduxOptions.enhancer
      );
    });
  }
};
