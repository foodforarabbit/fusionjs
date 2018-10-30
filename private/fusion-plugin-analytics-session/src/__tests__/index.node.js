// @flow
/* eslint-env node */
import tape from 'tape-cup';

import plugin from '../server';
import {UUID, TIME_STAMP} from '../cookie-types/index';

const FixtureCookieType = {
  name: 'foo',
  options: {opt1: true},
  data: {id: UUID, time: TIME_STAMP},
};

const FixtureExtraCookieType = {name: 'bar', data: {id: UUID}};

tape(
  'AnalyticsSessions server plugin - middleware',
  (t): void => {
    const ctx = {
      cookies: {
        get: (): null => {
          t.pass('existence check of the cookie');
          return null;
        },

        set: (name, value, options): void => {
          t.equal(name, FixtureCookieType.name, 'name matched');

          const parsed = JSON.parse(value);
          const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          t.ok(regexUUID.test(parsed.id), 'UUID generated');
          t.equal(typeof parsed.time, 'number', 'Timestamp generated');

          t.deepEqual(
            options,
            {
              overwrite: false,
              expires: undefined,
              ...FixtureCookieType.options,
            },
            'valid options'
          );
        },
      },

      memoized: new Map(),
    };
    const next = () => t.pass('called next()');

    const deps = {pluginCookieType: FixtureCookieType};

    // $FlowFixMe
    const middleware = plugin.middleware(deps, plugin.provides(deps));
    middleware(ctx, next);

    t.end();
  }
);

tape(
  'AnalyticsSessions server plugin - middleware, multiple cookieTypes',
  (t): void => {
    const cookieTypes = [FixtureCookieType, FixtureExtraCookieType];
    var cookieIdx = 0;

    const ctx = {
      cookies: {
        get: (): null => {
          t.pass('existence check of the cookie');
          return null;
        },

        set: (name, value, options): void => {
          t.equal(name, cookieTypes[cookieIdx].name, 'name matched');

          const parsed = JSON.parse(value);
          const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          t.ok(regexUUID.test(parsed.id), 'UUID generated');

          cookieIdx++;
        },
      },

      memoized: new Map(),
    };
    const next = () => t.pass('called next()');

    const deps = {pluginCookieType: cookieTypes};

    // $FlowFixMe
    const middlewareWithMultiple = plugin.middleware(
      deps,
      // $FlowFixMe
      plugin.provides(deps)
    );

    middlewareWithMultiple(ctx, next);

    t.end();
  }
);

tape(
  'AnalyticsSessions server plugin - rolling session',
  async (t): Promise<void> => {
    const cookieSets = [];
    const ctx = {
      cookies: {
        get: (): null => (cookieSets.length ? cookieSets[0] : null),

        set: (name, value, options): number => cookieSets.push(options),
      },

      memoized: new Map(),
    };
    const next = () => t.pass('called next()');

    const deps = {
      pluginCookieType: {
        ...FixtureCookieType,
        rolling: true,
        options: {expires: 50},
      },
    };

    // $FlowFixMe
    const middleware = plugin.middleware(deps, plugin.provides(deps));
    middleware(ctx, next);
    await new Promise(
      (res: (result: Promise<void> | void) => void): TimeoutID =>
        setTimeout(res, 200)
    );
    // add a small time delay
    middleware(ctx, next);

    t.equal(
      Object.prototype.toString.call(cookieSets[0].expires),
      '[object Date]',
      'expires should be a date'
    );
    t.ok(
      cookieSets[0].expires < cookieSets[1].expires,
      'date should be rolling, ie. increasing each req'
    );

    t.end();
  }
);
