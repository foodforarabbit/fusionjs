// @flow
import server from './server.js';
import {
  ConfigToken,
  LocaleNegotiationToken as LocaleNegotiation,
} from './tokens.js';
import browser from './browser.js';
import type {FusionPlugin} from 'fusion-core';
import type {RosettaDepsType, RosettaServiceType} from './types.js';

export default (((__NODE__ ? server : browser): any): FusionPlugin<
  RosettaDepsType,
  RosettaServiceType
>);

export const RosettaConfigToken = ConfigToken;
export const LocaleNegotiationToken = LocaleNegotiation;
