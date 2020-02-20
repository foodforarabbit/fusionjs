// @flow
/* eslint-env browser */
import plugin from '../src/browser';

test('AnalyticsSessions browser plugin - basics', () => {
  const fixtureCookieType = {
    name: 'foo',
    data: {},
  };

  const cookieValue = {a: 1, b: {c: 2}};
  document.cookie = `a=1`;
  // eslint-disable-next-line
  document.cookie = `${fixtureCookieType.name}=${encodeURI(JSON.stringify(cookieValue))}`;
  document.cookie = `b=w`;

  const service =
    plugin.provides &&
    plugin.provides({
      pluginCookieType: fixtureCookieType,
    });

  const ctx = ({memoized: new Map()}: any);

  expect(service && service._from(ctx).get(fixtureCookieType)).toEqual(
    cookieValue
  );
});

test('AnalyticsSessions browser plugin - invalid JSON in cookies', () => {
  const fixtureCookieType = {
    name: 'foo',
    data: {},
  };

  document.cookie = `${fixtureCookieType.name}=zzz`;

  const service =
    plugin.provides &&
    plugin.provides({
      pluginCookieType: fixtureCookieType,
    });

  const ctx = ({memoized: new Map()}: any);

  expect(service && service._from(ctx).get(fixtureCookieType)).toEqual({});
});
