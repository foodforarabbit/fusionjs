// @flow
/* eslint-env node */
import {createPlugin, memoize} from 'fusion-core';
import type {FusionPlugin, Context} from 'fusion-core';

import {generateCookieData} from './cookie-types/index.js';
import {AnalyticsCookieTypeToken} from './tokens.js';

function safeJSONParse(str: string): {||} | any {
  try {
    return JSON.parse(str) || {};
  } catch (e) {
    return {};
  }
}

const getCookieData = (cookieType, incomingCookieData: any): any | string => {
  if (cookieType.rolling && incomingCookieData) {
    return incomingCookieData;
  }

  return JSON.stringify(generateCookieData(cookieType));
};

const getCookieExpiry = ({expires} = {}): void => {
  if (!expires) {
    return;
  }

  return new Date(Date.now() + expires);
};

const pluginFactory = () =>
  createPlugin({
    deps: {pluginCookieType: AnalyticsCookieTypeToken},

    provides: ({pluginCookieType}) => {
      class AnalyticsSessionCookie {
        ctx: any;
        cookieTypes: any;
        constructor(ctx: Context) {
          this.ctx = ctx;
          this.cookieTypes = Array.isArray(pluginCookieType)
            ? pluginCookieType
            : [pluginCookieType];
        }
        setCookie(cookieType): void {
          const {ctx} = this;
          const incomingCookieData = ctx.cookies.get(cookieType.name);
          if (!incomingCookieData || cookieType.rolling) {
            ctx.cookies.set(
              cookieType.name,
              getCookieData(cookieType, incomingCookieData),
              {
                overwrite: false,
                ...cookieType.options,
                expires: getCookieExpiry(cookieType.options),
              }
            );
          }
        }
        setCookies(): void {
          this.cookieTypes.forEach(
            (cookieType): void => {
              this.setCookie(cookieType);
            }
          );
        }
        get(cookieType: void): {||} | any {
          const {ctx} = this;

          // If no cookieType is provided, then assume the first cookieType
          const targetCookieType = cookieType || this.cookieTypes[0];

          // Return cookie
          return safeJSONParse(ctx.cookies.get(targetCookieType.name));
        }
      }

      const memoizedFactory = memoize(
        (ctx: Context): AnalyticsSessionCookie =>
          new AnalyticsSessionCookie(ctx)
      );

      return {
        from: (ctx): {||} | any => {
          // for backward-compatibility, from() will continue to return a value
          const sessionCookie = memoizedFactory(ctx);

          // $FlowFixMe
          return safeJSONParse(sessionCookie.get());
        },

        _from: memoizedFactory,
      };
    },

    middleware: (
      _: {|pluginCookieType: any|},
      AnalyticsSessionCookie: {|
        _from: any,
        from: (ctx: empty) => {||} | any,
      |}
    ): ((ctx: Context, next: () => Promise<void>) => Promise<void>) => {
      return (ctx: Context, next: () => Promise<void>): Promise<void> => {
        // TODO: only set cookie on certain requests
        const sessionCookie = AnalyticsSessionCookie._from(ctx);
        sessionCookie.setCookies();
        return next();
      };
    },
  });
export default ((__NODE__ && pluginFactory(): any): FusionPlugin<any, any>);
