// @flow
/* eslint-env browser */
import jsCookie from 'js-cookie';

import {createPlugin} from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';

import {
  AnalyticsCookieModuleToken,
  AnalyticsCookieTypeToken,
} from './tokens.js';

function safeJSONParse(str: string): {||} | any {
  try {
    return JSON.parse(str) || {};
  } catch (e) {
    return {};
  }
}

const pluginFactory = () =>
  createPlugin({
    deps: {
      pluginCookieType: AnalyticsCookieTypeToken,
      Cookies: AnalyticsCookieModuleToken.optional,
    },

    provides: ({pluginCookieType, Cookies = jsCookie}): {||} | any => {
      const cookieTypes = Array.isArray(pluginCookieType)
        ? pluginCookieType
        : [pluginCookieType];
      return safeJSONParse(Cookies.get(cookieTypes[0].name));
    },
  });

export default ((__BROWSER__ && pluginFactory(): any): FusionPlugin<any, any>);
