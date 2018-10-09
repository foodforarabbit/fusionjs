// @flow
/* eslint-env browser */
import jsCookie from 'js-cookie';
import {createPlugin} from 'fusion-core';
import {AnalyticsCookieModuleToken, AnalyticsCookieTypeToken} from './tokens';

function safeJSONParse(str) {
  try {
    return JSON.parse(str) || {};
  } catch (e) {
    return {};
  }
}

export default __BROWSER__ &&
  createPlugin({
    deps: {
      cookieType: AnalyticsCookieTypeToken,
      Cookies: AnalyticsCookieModuleToken.optional,
    },
    provides: ({cookieType, Cookies = jsCookie}) => {
      return safeJSONParse(Cookies.get(cookieType.name));
    },
  });
