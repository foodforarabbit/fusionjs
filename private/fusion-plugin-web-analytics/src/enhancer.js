// @flow
import {createPlugin} from 'fusion-core';
import {UberWebAnalyticsToken} from './tokens';

import type {FusionPlugin} from 'fusion-core';
import type {StoreEnhancer, StoreCreator, Store} from 'redux';

type WebAnalyticsEnhancerType = (
  prev?: StoreEnhancer<*, *, *>
) => FusionPlugin<
  {
    webAnalytics: typeof UberWebAnalyticsToken,
  },
  StoreEnhancer<*, *, *>
>;

const createWebAnalyticsReduxEnhancer: WebAnalyticsEnhancerType = (
  prev?: StoreEnhancer<*, *, *>
) =>
  createPlugin({
    deps: {
      webAnalytics: UberWebAnalyticsToken,
    },
    provides({webAnalytics}) {
      const service: StoreEnhancer<*, *, *> = (
        createStore: StoreCreator<*, *, *>
      ) => (...args: *) => {
        const store: Store<*, *, *> = prev
          ? prev(createStore)(...args)
          : createStore(...args);
        return {
          ...store,
          dispatch: (action: Object) => {
            const dispatchResult = store.dispatch(action);

            if (__BROWSER__) {
              webAnalytics.eventContext.setReduxState(store.getState());
              if (action && action.type) {
                webAnalytics.track(action.type, action);
              }
            }

            return dispatchResult;
          },
        };
      };
      return service;
    },
  });

export default createWebAnalyticsReduxEnhancer;
