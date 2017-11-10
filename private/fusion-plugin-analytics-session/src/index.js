/* eslint-env browser */
import server from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);

import UberWebEventCookie from './cookie-types/uber-web-event';

export {UberWebEventCookie};
