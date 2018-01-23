/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {AnalyticsCookieModuleToken, AnalyticsCookieTypeToken} from './tokens';

function safeJSONParse(str) {
  try {
    return JSON.parse(str) || {};
  } catch (e) {
    return {};
  }
}

export default createPlugin({
  deps: {
    cookieType: AnalyticsCookieTypeToken,
    Cookies: AnalyticsCookieModuleToken,
  },
  provides: ({cookieType, Cookies}) => {
    return safeJSONParse(Cookies.get(cookieType.name));
  },
});
