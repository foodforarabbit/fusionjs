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
      pluginCookieType: AnalyticsCookieTypeToken,
      Cookies: AnalyticsCookieModuleToken.optional,
    },
    provides: ({pluginCookieType, Cookies = jsCookie}) => {
      const cookieTypes = Array.isArray(pluginCookieType)
        ? pluginCookieType
        : [pluginCookieType];
      return safeJSONParse(Cookies.get(cookieTypes[0].name));
    },
  });
