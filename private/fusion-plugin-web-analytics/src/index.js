// @flow
/* eslint-env node, browser */
import server from './server.js';
import browser from './browser.js';
import createWebAnalyticsReduxEnhancer from './enhancer.js';
import {DOMEventsTracker, serializePayload} from './dom-events-tracker';

export default __NODE__ ? server : browser;
export {
  UberWebAnalyticsToken,
  UberWebAnalyticsStateToken,
  UberWebAnalyticsFliprToken,
  UberWebAnalyticsFliprConfigToken,
} from './tokens';
export const UberWebAnalyticsFliprConfig = __NODE__
  ? {
      defaultNamespace: 'uwa-config',
    }
  : {};
export {createWebAnalyticsReduxEnhancer};
export {DOMEventsTracker};
export {serializePayload};
