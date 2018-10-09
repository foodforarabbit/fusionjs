// @flow
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

const getCookieData = (cookieType, incomingCookieData) => {
  if (cookieType.rolling && incomingCookieData) {
    return incomingCookieData;
  }

  return JSON.stringify(generateCookieData(cookieType));
};

const getCookieExpiry = ({expires}) => {
  if (!expires) {
    return;
  }

  return new Date(Date.now() + expires);
};

export default __NODE__ &&
  createPlugin({
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
        return next();
      };
    },
  });
