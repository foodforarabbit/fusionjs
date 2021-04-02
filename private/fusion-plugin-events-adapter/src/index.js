// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

export {
  EventsAdapterToken,
  EventsAdapterAnalyticsToken,
  EventsAdapterMiddlewareTimingAllowListToken,
} from './tokens';
export {webEventsMetaMapper} from './browser';

declare var __NODE__: Boolean;
const plugin = __NODE__ ? server : browser;
export default plugin;
