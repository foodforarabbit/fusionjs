// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

export {EventsAdapterToken, EventsAdapterAnalyticsToken} from './tokens';
export {webEventsMetaMapper} from './browser';

declare var __NODE__: Boolean;
export default (__NODE__ ? server : browser);
