// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

export {EventsAdapterToken, EventsAdapterAnalyticsToken} from './tokens';

declare var __NODE__: Boolean;
export default (__NODE__ ? server : browser);
