// @flow
/* eslint-env browser */
import {createPlugin, memoize} from 'fusion-core';
import {AnalyticsCookieModuleToken, AnalyticsCookieTypeToken} from './tokens';
import CookiesParser from './utils/cookies-parser';

import type {FusionPlugin} from 'fusion-core';
import type {PluginType, DepsType, CookieTypeType} from './types.js';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      pluginCookieType: AnalyticsCookieTypeToken,
      Cookies: AnalyticsCookieModuleToken.optional,
    },
    provides: ({pluginCookieType, Cookies}) => {
      // To prevent cookie tampered by others on the browser
      const CookieAPI =
        Cookies || new CookiesParser(document && document.cookie);

      class AnalyticsSessionCookie {
        cookieTypes: Array<CookieTypeType>;

        constructor() {
          this.cookieTypes = Array.isArray(pluginCookieType)
            ? pluginCookieType
            : [pluginCookieType];
        }

        set() {
          if (__DEV__) {
            throw new Error(
              '[fusion-plugin-analytics-session] set() is not supported in browsers'
            );
          }
        }

        get(cookieType) {
          // If no cookieType is provided, then assume the first cookieType
          const targetCookieType = cookieType || this.cookieTypes[0];
          return CookieAPI.get(targetCookieType.name);
        }
      }

      const memoizedFactory = memoize(ctx => new AnalyticsSessionCookie());
      return {
        // for backward-compatibility, from() will continue to return a value
        from: ctx => {
          const sessionCookie = memoizedFactory(ctx);
          return sessionCookie.get();
        },
        _from: memoizedFactory,
      };
    },
  });

export default ((plugin: any): FusionPlugin<DepsType, PluginType>);
