import {createToken, createOptionalToken} from 'fusion-tokens';
import jsCookie from 'js-cookie';

export const AnalyticsCookieTypeToken = createToken(
  'AnalyticsSessionCookieType'
);
export const AnalyticsCookieModuleToken = createOptionalToken(
  'AnalyticsCookieModule',
  jsCookie
);
export const AnalyticsSessionToken = createToken('AnalyticsSession');
