// @flow
import server, {
  ConfigToken,
  LocaleNegotiationToken as LocaleNegotiation,
} from './server.js';
import browser from './browser.js';

export default (((__NODE__ ? server : browser): any): typeof server);

export const RosettaConfigToken = __NODE__ && ConfigToken;
export const LocaleNegotiationToken = __NODE__ && LocaleNegotiation;
