/* eslint-env browser */
import tape from 'tape-cup';
import Plugin from '../../browser';

const loadGA = () => {};

function createMock() {
  const mock = (...args) => {
    mock.args.push(args);
  };
  mock.args = [];
  return mock;
}

tape('ga plugin browser', t => {
  const mock = createMock();
  t.throws(() => Plugin(), /Tracking id required/, 'trackingId is required');
  const PluginClass = Plugin({loadGA, mock, trackingId: 'test-id'});
  t.ok(PluginClass, 'returns a plugin class');
  t.equal(typeof PluginClass.of, 'function', 'exposes an of function');
  const ga = PluginClass.of();
  t.ok(ga, 'returns a service from of');
  t.equal(mock.args[0][0], 'create', 'calls create');
  t.equal(mock.args[0][1], 'test-id', 'users correct trackingId');
  t.equal(mock.args[0][2], 'auto', 'defaults cookie domain to auto');
  t.equal(mock.args[0][3], 'test_id', 'uses name replacing dashes');
  t.equal(mock.args.length, 1, 'only calls ga.create by default');
  t.end();
});

tape('initializeFeatures', t => {
  const mock = createMock();
  const PluginClass = Plugin({
    loadGA,
    mock,
    trackingId: 'test-id',
    advertiserFeatures: true,
    anonymizeIp: true,
    linkAttribution: true,
    trackPage: true,
  });
  PluginClass.of();
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

tape('identify', t => {
  const mock = createMock();
  const PluginClass = Plugin({loadGA, mock, trackingId: 'test-id'});
  const ga = PluginClass.of();
  t.equal(typeof ga.identify, 'function', 'exposes an identify function');
  ga.identify('test-id');
  const userIdArgs = mock.args.pop();
  t.equal(userIdArgs[0], 'test_id.set', 'calls set method');
  t.equal(userIdArgs[1], 'userId', 'passes userId string');
  t.equal(userIdArgs[2], 'test-id', 'passes correct id through');
  t.end();
});

tape('pageview', t => {
  const mock = createMock();
  const PluginClass = Plugin({loadGA, mock, trackingId: 'test-id'});
  const ga = PluginClass.of();
  t.equal(typeof ga.pageview, 'function', 'exposes an pageview function');
  ga.pageview({
    title: 'test-title',
    page: 'test-page',
    location: 'data',
  });
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

tape('track', t => {
  const mock = createMock();
  const PluginClass = Plugin({loadGA, mock, trackingId: 'test-id'});
  const ga = PluginClass.of();
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
