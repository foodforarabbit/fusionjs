// @flow
import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

export const AnalyticsCookieTypeToken: Token<any> = createToken(
  'AnalyticsSessionCookieType'
);
export const AnalyticsCookieModuleToken: Token<any> = createToken(
  'AnalyticsCookieModule'
);
export const AnalyticsSessionToken: Token<any> = createToken(
  'AnalyticsSession'
);
