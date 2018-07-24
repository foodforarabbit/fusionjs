// @flow
import type FusionApp from 'fusion-core';

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
  }

  // universal plugins
  app.register(ReduxToken, ReactReduxPlugin);
  app.register(ReducerToken, reduxOptions.reducer);
  app.register(EnhancerToken, ActionEmitterEnhancerPlugin);
  if (reduxOptions.enhancer) {
    app.enhance(EnhancerToken, prevEnhancer => {
      return compose(prevEnhancer, reduxOptions.enhancer);
    });
  }
};
