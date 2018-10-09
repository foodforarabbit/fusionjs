// @flow
/* eslint-env node */
import tape from 'tape-cup';

import plugin from '../server';
import {UUID, TIME_STAMP} from '../cookie-types/index';

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

tape('AnalyticsSessions server plugin - middleware', t => {
  const ctx = {
    cookies: {
      get: () => {
        t.pass('existence check of the cookie');
        return null;
      },
      set: (name, value, options) => {
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
  };
  const next = () => t.pass('called next()');

  const middleware = plugin.middleware({cookieType: FixtureCookieType});
  middleware(ctx, next);

  t.end();
});

tape('AnalyticsSessions server plugin - rolling session', async t => {
  const cookieSets = [];
  const ctx = {
    cookies: {
      get: () => (cookieSets.length ? cookieSets[0] : null),
      set: (name, value, options) => cookieSets.push(options),
    },
  };
  const next = () => t.pass('called next()');

  const middleware = plugin.middleware({
    cookieType: {
      ...FixtureCookieType,
      rolling: true,
      options: {
        expires: 50,
      },
    },
  });
  middleware(ctx, next);
  await new Promise(res => setTimeout(res, 200)); // add a small time delay
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
});

tape('AnalyticsSessions browser plugin - service - basics', t => {
  const fixtureCookieType = {
    name: 'foo',
  };

  const cookieValue = {a: 1, b: {c: 2}};

  const ctx = {
    memoized: new Map(),
    cookies: {
      get: name => {
        t.pass('gets cookie');
        t.equal(
          name,
          fixtureCookieType.name,
          'passing in cookie name from the cookieType'
        );
        return JSON.stringify(cookieValue);
      },
    },
  };

  const service = plugin.provides({
    cookieType: fixtureCookieType,
  });

  t.deepEqual(service.from(ctx), cookieValue);
  t.end();
});

tape(
  'AnalyticsSessions browser plugin - service - invalid JSON in cookies',
  t => {
    const fixtureCookieType = {
      name: 'foo',
    };

    const ctx = {
      memoized: new Map(),
      cookies: {
        get: name => {
          t.pass('gets cookie');
          t.equal(
            name,
            fixtureCookieType.name,
            'passing in cookie name from the cookieType'
          );
          return 'zzz';
        },
      },
    };

    const service = plugin.provides({
      cookieType: fixtureCookieType,
    });

    t.doesNotThrow(() => service.from(ctx), 'safely parses cookie values');
    t.deepEqual(service.from(ctx), {}, 'returns an empty object');
    t.end();
  }
);
