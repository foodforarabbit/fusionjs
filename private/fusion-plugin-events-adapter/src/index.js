/* eslint-env browser */
import server from './server';
import browser from './browser';

export {EventsAdapterToken, EventsAdapterAnalyticsToken} from './tokens';

export default (__NODE__ ? server : browser);
