// @flow
import server from './server.js';
import {
  ConfigToken,
  LocaleNegotiationToken as LocaleNegotiation,
} from './tokens.js';
import browser from './browser.js';

export default (((__NODE__ ? server : browser): any): typeof server);

export const RosettaConfigToken = ConfigToken;
export const LocaleNegotiationToken = LocaleNegotiation;
