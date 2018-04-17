import React from 'react';
import {createPlugin, createToken} from 'fusion-core';
import {Router, browserHistory} from 'react-router';

const ReactRouterV3HistoryToken = createToken('ReactRouterV3HistoryToken');

export default createPlugin({
  deps: {
    history: ReactRouterV3HistoryToken.optional,
  },
  middleware: ({history}) => (ctx, next) => {
    if (!ctx.element) {
      return next();
    }

    // ATTENTION: the plugin depends on the registration order
    const routes = ctx.element;

    // TODO: syncHistoryWithStore
    ctx.element = <Router history={history || browserHistory}>{routes}</Router>;
    return next();
  },
});

export {ReactRouterV3HistoryToken};
