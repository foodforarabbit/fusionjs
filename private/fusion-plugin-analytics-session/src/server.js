// @flow
/* eslint-env node */
import {createPlugin, memoize} from 'fusion-core';
import {generateCookieData} from './cookie-types/index';
import {AnalyticsCookieTypeToken} from './tokens';
import {safeJSONStringify, safeJSONParse} from './utils/json';

import type {CookiesSetOptions} from 'koa';
import type {FusionPlugin, Context} from 'fusion-core';
import type {PluginType, DepsType, CookieTypeType} from './types.js';

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

        refreshCookie(cookieType) {
          const incomingCookieData = this.get(cookieType);
          if (!incomingCookieData || cookieType.rolling) {
            this.set(
              cookieType,
              incomingCookieData || generateCookieData(cookieType)
            );
          }
        }

        refreshCookies() {
          this.cookieTypes.forEach(cookieType => {
            this.refreshCookie(cookieType);
          });
        }

        set(cookieType, data) {
          const {ctx} = this;
          const expiresMs = cookieType.options && cookieType.options.expires;
          ctx.cookies.set(
            cookieType.name,
            safeJSONStringify(data),
            ({
              ...cookieType.options,
              expires:
                expiresMs &&
                new Date(Date.now() + new Date(expiresMs).getTime()),
            }: $Shape<CookiesSetOptions>)
          );
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
        sessionCookie.refreshCookies();
        return next();
      };
    },
  });

export default ((plugin: any): FusionPlugin<DepsType, PluginType>);
