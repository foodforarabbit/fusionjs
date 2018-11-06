// @flow
/* eslint-env node */

import Plugin from '../server';
import {UUID, TIME_STAMP} from '../cookie-types/index';

const plugin: any = Plugin;

const FixtureCookieType = {
  name: 'foo',
  options: {
    opt1: true,
  },
  data: {
    id: UUID,
    time: TIME_STAMP,
  },
};

const FixtureExtraCookieType = {
  name: 'bar',
  data: {
    id: UUID,
  },
};

test('AnalyticsSessions server plugin - middleware', () => {
  const ctx: any = {
    cookies: {
      get: () => {
        return null;
      },
      set: (name, value, options) => {
        expect(name).toBe(FixtureCookieType.name);

        const parsed = JSON.parse(value);
        const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexUUID.test(parsed.id)).toBeTruthy();
        expect(typeof parsed.time).toBe('number');

        expect(options).toEqual({
          expires: undefined,
          ...FixtureCookieType.options,
        });
      },
    },
    memoized: new Map(),
  };
  const next = () => {};

  const deps = {pluginCookieType: FixtureCookieType};
  const middleware = plugin.middleware(deps, plugin.provides(deps));
  middleware(ctx, next);
});

test('AnalyticsSessions server plugin - middleware, multiple cookieTypes', () => {
  const cookieTypes = [FixtureCookieType, FixtureExtraCookieType];
  var cookieIdx = 0;

  const ctx: any = {
    cookies: {
      get: () => {
        return null;
      },
      set: (name, value, options) => {
        expect(name).toBe(cookieTypes[cookieIdx].name);

        const parsed = JSON.parse(value);
        const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexUUID.test(parsed.id)).toBeTruthy();

        cookieIdx++;
      },
    },
    memoized: new Map(),
  };
  const next = () => {};

  const deps = {
    pluginCookieType: cookieTypes,
  };
  const middlewareWithMultiple = plugin.middleware(deps, plugin.provides(deps));

  middlewareWithMultiple(ctx, next);
});

test('AnalyticsSessions server plugin - rolling session', async () => {
  const cookieSets = [];
  const ctx: any = {
    cookies: {
      get: () => (cookieSets.length ? cookieSets[0] : null),
      set: (name, value, options) => cookieSets.push(options),
    },
    memoized: new Map(),
  };
  const next = () => {};

  const deps = {
    pluginCookieType: {
      ...FixtureCookieType,
      rolling: true,
      options: {
        expires: 50,
      },
    },
  };

  const middleware = plugin.middleware(deps, plugin.provides(deps));

  middleware(ctx, next);
  await new Promise(res => setTimeout(res, 200)); // add a small time delay
  middleware(ctx, next);

  expect(Object.prototype.toString.call(cookieSets[0].expires)).toBe(
    '[object Date]'
  );
  expect(cookieSets[0].expires < cookieSets[1].expires).toBeTruthy();
});
