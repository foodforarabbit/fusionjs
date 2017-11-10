/* eslint-env browser */
import tape from 'tape-cup';
import plugin from '../../browser';

tape('AnalyticsSessions browser plugin - deps check', t => {
  t.throws(() => plugin({}), 'Should throw without cookieType');
  t.end();
});

tape('AnalyticsSessions browser plugin - basics', t => {
  const fixtureCookieType = {
    name: 'foo',
  };

  const cookieValue = {a: 1, b: {c: 2}};

  const fixtureCookies = {
    get: name => {
      t.pass('get cookie');
      t.equal(
        name,
        fixtureCookieType.name,
        'passing in cookie name from the cookieType'
      );
      return JSON.stringify(cookieValue);
    },
  };

  const service = plugin({
    cookieType: fixtureCookieType,
    Cookies: fixtureCookies,
  });

  t.deepEqual(service.of(), cookieValue);
  t.end();
});

tape('AnalyticsSessions browser plugin - invalid JSON in cookies', t => {
  const fixtureCookieType = {
    name: 'foo',
  };

  const fixtureCookies = {
    get: name => {
      t.pass('get cookie');
      t.equal(
        name,
        fixtureCookieType.name,
        'passing in cookie name from the cookieType'
      );
      return 'zzz';
    },
  };

  const service = plugin({
    cookieType: fixtureCookieType,
    Cookies: fixtureCookies,
  });

  t.doesNotThrow(() => service.of(), 'safely parses cookie values');
  t.deepEqual(service.of(), {}, 'returns an empty object');
  t.end();
});
