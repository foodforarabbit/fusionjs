// @flow
/* eslint-env browser */
import server from './serverPlugin/server.js';
import serverWarn from './serverPlugin/browser.js';

import browserWarn from './MarketingBrowserPlugin/server.js';
import browser from './MarketingBrowserPlugin/browser.js';

export const MarketingBrowserPlugin = __NODE__ ? browserWarn : browser;
export default __NODE__ ? server : serverWarn;
export {
  UberMarketingToken,
  UberMarketingBrowserToken,
  UberMarketingConfigToken,
  UberMarketingCanActivateToken,
} from './tokens';
