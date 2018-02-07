// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';
import routeTiming from '../handlers/route-timing';

tape('route timing - pageview:server', t => {
  const events = new EventEmitter();
  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'pageview_server', 'logs the correct key');
      t.deepLooseEqual(tags, {route: 'test'}, 'logs the correct tags');
      t.end();
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3});

  events.emit('pageview:server', {title: 'test'});
});

tape('route timing - pageview:browser', t => {
  const events = new EventEmitter();
  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'pageview_browser', 'logs the correct key');
      t.deepLooseEqual(tags, {route: 'test'}, 'logs the correct tags');
      t.end();
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3});

  events.emit('pageview:browser', {title: 'test'});
});

tape('route timing - route_time', t => {
  const events = new EventEmitter();
  const mockM3 = {
    increment() {},
    timing(key, value, tags) {
      t.equal(key, 'route_time', 'logs the correct key');
      t.equal(value, 5, 'logs the correct value');
      t.deepLooseEqual(
        tags,
        {route: 'test-route', status: 'test-status'},
        'logs the correct tags'
      );
      t.end();
    },
  };

  routeTiming({events, m3: mockM3});

  events.emit('pageview:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});

tape('route timing - render:server', t => {
  const events = new EventEmitter();
  const mockM3 = {
    increment() {},
    timing(key, value, tags) {
      t.equal(key, 'render_server', 'logs the correct key');
      t.equal(value, 5, 'logs the correct value');
      t.deepLooseEqual(
        tags,
        {route: 'test-route', status: 'test-status'},
        'logs the correct tags'
      );
      t.end();
    },
  };

  routeTiming({events, m3: mockM3});

  events.emit('render:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});
