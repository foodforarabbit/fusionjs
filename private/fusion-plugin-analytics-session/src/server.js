/* eslint-env node */
import assert from 'assert';
import {Plugin} from 'fusion-core';
import {generateCookieData} from './cookie-types/index';

function safeJSONParse(str) {
  try {
    return JSON.parse(str) || {};
  } catch (e) {
    return {};
  }
}

export default ({cookieType}) => {
  assert(
    cookieType,
    `AnalyticsSessionPlugin requires a valid cookieType. E.g. \`import {UberWebEventCookie} from 'fusion-plugin-analytics-session/cookie-types';\``
  );
  return new Plugin({
    Service: class AnalyticsSession {
      constructor(ctx) {
        assert(
          ctx,
          'AnalyticsSession service need to be instantiated with valid context. `AnalyticsSession.of(ctx)`'
        );
        return safeJSONParse(ctx.cookies.get(cookieType.name));
      }
    },
    middleware(ctx, next) {
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
    },
  });
};
