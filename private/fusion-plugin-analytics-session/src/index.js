// @flow
/* eslint-env browser */
import server from './server.js';
import browser from './browser.js';
import UberWebEventCookie from './cookie-types/uber-web-event.js';

export default __NODE__ ? server : browser;

export {UberWebEventCookie};
export {CookieDataTypes} from './cookie-types/index.js';

export {AnalyticsCookieTypeToken, AnalyticsSessionToken} from './tokens.js';
