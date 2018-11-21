// @flow
/* eslint-env node */
import {createPlugin, memoize} from 'fusion-core';
import {generateCookieData} from './cookie-types/index';
import {AnalyticsCookieTypeToken} from './tokens';

import type {CookiesSetOptions} from 'koa';
import type {FusionPlugin, Context} from 'fusion-core';
import type {PluginType, DepsType, CookieTypeType} from './types.js';

function safeJSONParse(str): Object {
  try {
    return JSON.parse(str || '') || {};
  } catch (e) {
    return {};
  }
}

const getCookieData = (cookieType, incomingCookieData) => {
  if (cookieType.rolling && incomingCookieData) {
    return incomingCookieData;
  }

  return JSON.stringify(generateCookieData(cookieType));
};

const getCookieExpiry = ({expires} = {}) => {
  if (!expires) {
    return;
  }

  return new Date(Date.now() + expires);
};

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      pluginCookieType: AnalyticsCookieTypeToken,
    },
    provides: ({pluginCookieType}) => {
      class AnalyticsSessionCookie {
        cookieTypes: Array<CookieTypeType>;
        ctx: Context;

        constructor(ctx: Context) {
          this.ctx = ctx;
          this.cookieTypes = Array.isArray(pluginCookieType)
            ? pluginCookieType
            : [pluginCookieType];
        }
        setCookie(cookieType) {
          const {ctx} = this;
          const incomingCookieData = ctx.cookies.get(cookieType.name);
          if (!incomingCookieData || cookieType.rolling) {
            ctx.cookies.set(
              cookieType.name,
              getCookieData(cookieType, incomingCookieData),
              ({
                ...cookieType.options,
                expires: getCookieExpiry(cookieType.options),
              }: $Shape<CookiesSetOptions>)
            );
          }
        }
        setCookies() {
          this.cookieTypes.forEach(cookieType => {
            this.setCookie(cookieType);
          });
        }
        get(cookieType) {
          const {ctx} = this;
          // If no cookieType is provided, then assume the first cookieType
          const targetCookieType = cookieType || this.cookieTypes[0];

          // Return cookie
          return safeJSONParse(ctx.cookies.get(targetCookieType.name));
        }
      }

      const memoizedFactory = memoize(ctx => new AnalyticsSessionCookie(ctx));
      return {
        // for backward-compatibility, from() will continue to return a value
        from: ctx => {
          const sessionCookie = memoizedFactory(ctx);
          return sessionCookie.get();
        },
        _from: memoizedFactory,
      };
    },
    middleware: (_, AnalyticsSessionCookie) => {
      return (ctx, next) => {
        // TODO: only set cookie on certain requests
        const sessionCookie = AnalyticsSessionCookie._from(ctx);
        sessionCookie.setCookies();
        return next();
      };
    },
  });

export default ((plugin: any): FusionPlugin<DepsType, PluginType>);
