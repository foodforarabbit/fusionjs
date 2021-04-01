// @flow
import server from './server.js';
import {
  ConfigToken,
  LocaleNegotiationToken as LocaleNegotiation,
  GetTranslationsToken as GetTranslations,
} from './tokens.js';
import browser from './browser.js';
import type {FusionPlugin} from 'fusion-core';
import type {RosettaDepsType, RosettaServiceType} from './types.js';
import mock from './mock.js';
import {getTranslationsV2, translateKeyV2, translateKeysV2} from './get-translations-v2';

export default (((__NODE__ ? server : browser): any): FusionPlugin<
  RosettaDepsType,
  RosettaServiceType
>);

export const RosettaConfigToken = ConfigToken;
export const LocaleNegotiationToken = LocaleNegotiation;
export const GetTranslationsToken = GetTranslations;
export {mock, getTranslationsV2, translateKeyV2, translateKeysV2};