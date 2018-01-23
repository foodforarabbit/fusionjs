/* eslint-env browser */
import server from './server';
import browser from './browser';
import UberWebEventCookie from './cookie-types/uber-web-event';

export default (__NODE__ ? server : browser);

export {UberWebEventCookie};
export {AnalyticsCookieTypeToken, AnalyticsSessionToken} from './tokens';
