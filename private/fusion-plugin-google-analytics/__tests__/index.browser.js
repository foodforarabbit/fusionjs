// @flow
/* eslint-env browser */
import Plugin from '../src/browser';

const loadGA = (): void => {};

type Mock = {
  (...args: empty): void,
  args: Array<Array<string>>,
};

function createMock(): Mock {
  const mock = (...args): void => {
    mock.args.push(args);
  };
  mock.args = [];
  return mock;
}

test('ga plugin browser', () => {
  const mock = createMock();
  expect(
    // $FlowFixMe
    () => Plugin.provides({options: {}})
  ).toThrow(/Tracking id required/);
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  expect(ga).toBeTruthy();
  expect(mock.args[0][0]).toBe('create');
  expect(mock.args[0][1]).toBe('test-id');
  expect(mock.args[0][2]).toBe('auto');
  expect(mock.args[0][3]).toBe('test_id');

  expect(mock.args[1][0]).toBe('test_id.send');
  expect(mock.args[1][1]).toBe('pageview');

  expect(mock.args.length).toBe(2);
});

test('initializeFeatures', () => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {
      loadGA,
      mock,
      trackingId: 'test-id',
      advertiserFeatures: true,
      anonymizeIp: true,
      linkAttribution: true,
      trackPage: true,
    },
  });
  expect(ga).toBeTruthy();
  expect(mock.args[1][0]).toBe('test_id.require');
  expect(mock.args[1][1]).toBe('displayfeatures');

  expect(mock.args[2][0]).toBe('test_id.require');
  expect(mock.args[2][1]).toBe('linkid');
  expect(mock.args[2][2]).toBe('linkid.js');

  expect(mock.args[3][0]).toBe('test_id.send');
  expect(mock.args[3][1]).toBe('pageview');

  expect(mock.args[4][0]).toBe('test_id.set');
  expect(mock.args[4][1]).toBe('anonymizeIp');
  expect(mock.args[4][2]).toBe(true);
});

test('identify', () => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  expect(typeof ga.identify).toBe('function');
  ga.identify('test-id');
  const userIdArgs = mock.args.pop();
  expect(userIdArgs[0]).toBe('test_id.set');
  expect(userIdArgs[1]).toBe('userId');
  expect(userIdArgs[2]).toBe('test-id');
});

test('pageview', () => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  expect(typeof ga.pageview).toBe('function');
  ga.pageview({title: 'test-title', page: 'test-page', location: 'data'});
  mock.args.pop();
  let pageviewArgs = mock.args.pop();
  expect(pageviewArgs[0]).toBe('test_id.set');
  expect(pageviewArgs[1]).toStrictEqual({
    title: 'test-title',
    page: 'test-page',
    location: 'data',
  });

  ga.pageview({});
  mock.args.pop();
  pageviewArgs = mock.args.pop();
  expect(pageviewArgs[0]).toBe('test_id.set');
  expect(pageviewArgs[1]).toStrictEqual({
    title: document.title,
    page: window.location.pathname,
    location: window.location.href,
  });
});

test('track', () => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  expect(typeof ga.track).toBe('function');
  ga.track({
    eventCategory: 'test-name',
    eventAction: 'test-type',
    eventLabel: 'test-value',
    eventValue: 5,
  });
  const trackArgs = mock.args.pop();
  expect(trackArgs[0]).toBe('test_id.send');
  expect(trackArgs[1]).toBe('event');
  expect(trackArgs[2]).toStrictEqual({
    eventCategory: 'test-name',
    eventAction: 'test-type',
    eventLabel: 'test-value',
    eventValue: 5,
  });
});
