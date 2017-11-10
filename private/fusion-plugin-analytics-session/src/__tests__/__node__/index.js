/* eslint-env node */
import tape from 'tape-cup';
import plugin from '../../server';
import {UUID, TIME_STAMP} from '../../cookie-types/index';

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

tape('AnalyticsSessions server plugin - deps check', t => {
  t.throws(() => plugin({}), 'Should throw without cookieType');
  t.end();
});

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
            ...FixtureCookieType.options,
          },
          'valid options'
        );
      },
    },
  };
  const next = () => t.pass('called next()');

  const {middleware} = plugin({cookieType: FixtureCookieType});
  middleware(ctx, next);

  t.end();
});

tape('AnalyticsSessions browser plugin - service - ctx required', t => {
  const fixtureCookieType = {
    name: 'foo',
  };

  const service = plugin({
    cookieType: fixtureCookieType,
  });

  t.throws(() => service.of(), 'Server plugin requires ctx to instantiate');
  t.end();
});

tape('AnalyticsSessions browser plugin - service - basics', t => {
  const fixtureCookieType = {
    name: 'foo',
  };

  const cookieValue = {a: 1, b: {c: 2}};

  const ctx = {
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

  const service = plugin({
    cookieType: fixtureCookieType,
  });

  t.deepEqual(service.of(ctx), cookieValue);
  t.end();
});

tape(
  'AnalyticsSessions browser plugin - service - invalid JSON in cookies',
  t => {
    const fixtureCookieType = {
      name: 'foo',
    };

    const ctx = {
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

    const service = plugin({
      cookieType: fixtureCookieType,
    });

    t.doesNotThrow(() => service.of(ctx), 'safely parses cookie values');
    t.deepEqual(service.of(ctx), {}, 'returns an empty object');
    t.end();
  }
);
