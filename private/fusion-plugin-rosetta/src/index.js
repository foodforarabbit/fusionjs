// @flow
import server, {
  ConfigToken,
  LocaleNegotiationToken as LocaleNegotiation,
} from './server';
import browser from './browser';

declare var __NODE__: Boolean;
export default (__NODE__ ? server : browser);
export const RosettaConfigToken = __NODE__ && ConfigToken;
export const LocaleNegotiationToken = __NODE__ && LocaleNegotiation;
