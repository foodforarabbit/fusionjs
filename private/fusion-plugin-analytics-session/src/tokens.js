// @flow
import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {CookieModuleType, CookieTypeType, PluginType} from './types';

export const AnalyticsCookieTypeToken: Token<
  Array<CookieTypeType> | CookieTypeType
> = createToken('AnalyticsSessionCookieType');
export const AnalyticsCookieModuleToken: Token<CookieModuleType> = createToken(
  'AnalyticsCookieModule'
);
export const AnalyticsSessionToken: Token<PluginType> = createToken(
  'AnalyticsSession'
);
