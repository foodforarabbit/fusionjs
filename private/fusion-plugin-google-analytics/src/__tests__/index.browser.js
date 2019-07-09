// @flow
/* eslint-env browser */
import tape from 'tape-cup';
import Plugin from '../browser';

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

tape('ga plugin browser', (t): void => {
  const mock = createMock();
  t.throws(
    // $FlowFixMe
    () => Plugin.provides({options: {}}),
    /Tracking id required/,
    'trackingId is required'
  );
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  t.ok(ga, 'returns a service from provides');
  t.equal(mock.args[0][0], 'create', 'calls create');
  t.equal(mock.args[0][1], 'test-id', 'users correct trackingId');
  t.equal(mock.args[0][2], 'auto', 'defaults cookie domain to auto');
  t.equal(mock.args[0][3], 'test_id', 'uses name replacing dashes');

  t.equal(mock.args[1][0], 'test_id.send', 'calls send');
  t.equal(mock.args[1][1], 'pageview', 'sending pageview');

  t.equal(mock.args.length, 2, 'ga.create then pageview tracking by default');
  t.end();
});

tape('initializeFeatures', (t): void => {
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
  t.ok(ga);
  t.equal(mock.args[1][0], 'test_id.require');
  t.equal(mock.args[1][1], 'displayfeatures');

  t.equal(mock.args[2][0], 'test_id.require');
  t.equal(mock.args[2][1], 'linkid');
  t.equal(mock.args[2][2], 'linkid.js');

  t.equal(mock.args[3][0], 'test_id.send');
  t.equal(mock.args[3][1], 'pageview');

  t.equal(mock.args[4][0], 'test_id.set');
  t.equal(mock.args[4][1], 'anonymizeIp');
  t.equal(mock.args[4][2], true);
  t.end();
});

tape('identify', (t): void => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  t.equal(typeof ga.identify, 'function', 'exposes an identify function');
  ga.identify('test-id');
  const userIdArgs = mock.args.pop();
  t.equal(userIdArgs[0], 'test_id.set', 'calls set method');
  t.equal(userIdArgs[1], 'userId', 'passes userId string');
  t.equal(userIdArgs[2], 'test-id', 'passes correct id through');
  t.end();
});

tape('pageview', (t): void => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  t.equal(typeof ga.pageview, 'function', 'exposes an pageview function');
  ga.pageview({title: 'test-title', page: 'test-page', location: 'data'});
  mock.args.pop();
  let pageviewArgs = mock.args.pop();
  t.equal(pageviewArgs[0], 'test_id.set');
  t.deepLooseEqual(pageviewArgs[1], {
    title: 'test-title',
    page: 'test-page',
    location: 'data',
  });

  ga.pageview({});
  mock.args.pop();
  pageviewArgs = mock.args.pop();
  t.equal(pageviewArgs[0], 'test_id.set');
  t.deepLooseEqual(pageviewArgs[1], {
    title: document.title,
    page: window.location.pathname,
    location: window.location.href,
  });
  t.end();
});

tape('track', (t): void => {
  const mock = createMock();
  // $FlowFixMe
  const ga = Plugin.provides({
    options: {loadGA, mock, trackingId: 'test-id'},
  });
  t.equal(typeof ga.track, 'function', 'exposes an track function');
  ga.track({
    eventCategory: 'test-name',
    eventAction: 'test-type',
    eventLabel: 'test-value',
    eventValue: 5,
  });
  const trackArgs = mock.args.pop();
  t.equal(trackArgs[0], 'test_id.send');
  t.equal(trackArgs[1], 'event');
  t.deepLooseEqual(trackArgs[2], {
    eventCategory: 'test-name',
    eventAction: 'test-type',
    eventLabel: 'test-value',
    eventValue: 5,
  });
  t.end();
});
