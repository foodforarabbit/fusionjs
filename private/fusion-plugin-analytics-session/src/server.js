/* eslint-env node */
import {createPlugin, memoize} from 'fusion-core';
import {generateCookieData} from './cookie-types/index';
import {AnalyticsCookieTypeToken} from './tokens';

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
  },
  provides: ({cookieType}) => {
    return {
      from: memoize(ctx => {
        return safeJSONParse(ctx.cookies.get(cookieType.name));
      }),
    };
  },
  middleware: ({cookieType}) => {
    return (ctx, next) => {
      // TODO: only set cookie on certain requests
      if (!ctx.cookies.get(cookieType.name)) {
        ctx.cookies.set(
          cookieType.name,
          JSON.stringify(generateCookieData(cookieType)),
          {
            overwrite: false,
            ...cookieType.options,
          }
        );
      }
      return next();
    };
  },
});
