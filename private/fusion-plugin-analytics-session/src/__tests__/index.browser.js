// @flow
/* eslint-env browser */
import tape from 'tape-cup';
import plugin from '../browser';

tape(
  'AnalyticsSessions browser plugin - basics',
  (t): void => {
    const fixtureCookieType = {name: 'foo'};

    const cookieValue = {a: 1, b: {c: 2}};

    const fixtureCookies = {
      get: (name): string => {
        t.pass('get cookie');
        t.equal(
          name,
          fixtureCookieType.name,
          'passing in cookie name from the cookieType'
        );
        return JSON.stringify(cookieValue);
      },
    };

    // $FlowFixMe
    const service = plugin.provides({
      pluginCookieType: fixtureCookieType,
      Cookies: fixtureCookies,
    });

    t.deepEqual(service, cookieValue);
    t.end();
  }
);

tape(
  'AnalyticsSessions browser plugin - invalid JSON in cookies',
  (t): void => {
    const fixtureCookieType = {name: 'foo'};

    const fixtureCookies = {
      get: (name): string => {
        t.pass('get cookie');
        t.equal(
          name,
          fixtureCookieType.name,
          'passing in cookie name from the cookieType'
        );
        return 'zzz';
      },
    };

    // $FlowFixMe
    const service = plugin.provides({
      pluginCookieType: fixtureCookieType,
      Cookies: fixtureCookies,
    });

    t.deepEqual(service, {}, 'returns an empty object');
    t.end();
  }
);
