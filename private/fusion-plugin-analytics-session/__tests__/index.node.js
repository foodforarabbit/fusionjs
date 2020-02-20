// @flow
/* eslint-env node */

import Plugin from '../src/server';
import {CookieDataTypes} from '../src/cookie-types/index';

const plugin: any = Plugin;

const FixtureCookieType = {
  name: 'foo',
  options: {
    opt1: true,
  },
  data: {
    id: CookieDataTypes.UUID,
    time: CookieDataTypes.TIME_STAMP,
  },
};

const FixtureExtraCookieType = {
  name: 'bar',
  data: {
    id: CookieDataTypes.UUID,
  },
};

const FixtureSimpleCookieType = {
  name: 'bar',
  data: CookieDataTypes.UUID,
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
      get: () =>
        cookieSets.length ? cookieSets[cookieSets.length - 1].value : null,
      set: (name, value, options) => cookieSets.push({value, options}),
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

  expect(Object.prototype.toString.call(cookieSets[0].options.expires)).toBe(
    '[object Date]'
  );
  expect(
    cookieSets[0].options.expires < cookieSets[1].options.expires
  ).toBeTruthy();

  expect(cookieSets[0].value).toEqual(cookieSets[1].value);
  const parsed = JSON.parse(cookieSets[1].value);
  expect(parsed.id).toBeTruthy();
});

test('AnalyticsSessions server plugin - data scheme as non-object(single value)', () => {
  const ctx: any = {
    cookies: {
      get: () => {
        return null;
      },
      set: (name, value, options) => {
        expect(name).toBe(FixtureSimpleCookieType.name);

        const parsed = JSON.parse(value);
        const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexUUID.test(parsed)).toBeTruthy();
      },
    },
    memoized: new Map(),
  };
  const next = () => {};

  const deps = {pluginCookieType: FixtureSimpleCookieType};
  const middleware = plugin.middleware(deps, plugin.provides(deps));
  middleware(ctx, next);
});

test('AnalyticsSessions server plugin - set()', () => {
  const fixtureUUID = 'c3f27148-9965-4e52-a0fc-0b470ef50117';
  const ctx: any = {
    _cookies: {},
    cookies: {
      get: name => {
        return ctx._cookies[name];
      },
      set: (name, value, options) => {
        expect(name).toBe(FixtureSimpleCookieType.name);
        const parsed = JSON.parse(value);
        const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexUUID.test(parsed)).toBeTruthy();
        ctx._cookies[name] = value;
      },
    },
    memoized: new Map(),
  };
  const next = () => {};

  const deps = {pluginCookieType: FixtureSimpleCookieType};
  const service = plugin.provides(deps);
  const middleware = plugin.middleware(deps, service);
  middleware(ctx, next);

  // some uniquely generated UUID
  expect(service._from(ctx).get(FixtureSimpleCookieType)).not.toEqual(
    fixtureUUID
  );
  // set a fixture value
  service
    ._from(ctx)
    .set(FixtureSimpleCookieType, 'c3f27148-9965-4e52-a0fc-0b470ef50117');
  // now should equal to the fixture value
  expect(service._from(ctx).get(FixtureSimpleCookieType)).toEqual(fixtureUUID);
});
