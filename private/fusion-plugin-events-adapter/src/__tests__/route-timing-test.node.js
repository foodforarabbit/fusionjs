// @flow
import EventEmitter from './custom-event-emitter.js';
import tape from 'tape-cup';
import routeTiming from '../handlers/route-timing';

tape('route timing - pageview:server', t => {
  const events = new EventEmitter();
  t.plan(4);
  const mockLogger = {
    info(message, meta) {
      t.equal(message, 'access log');
      t.deepLooseEqual(meta, {
        type: 'pageview:server',
        url: '/test',
        route: 'test',
        status: 200,
        timing: 5,
      });
    },
  };
  events.on('access-log', payload => mockLogger.info('access log', payload));
  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'pageview_server', 'logs the correct key');
      t.deepLooseEqual(
        tags,
        {route: 'test', status: 200},
        'logs the correct tags'
      );
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit(
    'pageview:server',
    {title: 'test', status: 200, timing: 5},
    {url: '/test'}
  );
  t.end();
});

tape('route timing - pageview:browser', t => {
  t.plan(4);
  const events = new EventEmitter();
  const mockLogger = {
    info(message, meta) {
      t.equal(message, 'access log');
      t.deepLooseEqual(meta, {
        type: 'pageview:browser',
        url: '/test',
        route: 'test',
        status: 200,
        timing: undefined,
      });
    },
  };
  events.on('access-log', payload => mockLogger.info('access log', payload));
  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'pageview_browser', 'logs the correct key');
      t.deepLooseEqual(
        tags,
        {route: 'test', status: 200},
        'logs the correct tags'
      );
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});
  events.emit('pageview:browser', {title: 'test', status: 200}, {url: '/test'});
  t.end();
});

tape('route timing - pageview:server - 404 not found', t => {
  t.plan(4);
  const events = new EventEmitter();
  const mockLogger = {
    info(message, meta) {
      t.equal(message, 'access log');
      t.deepLooseEqual(meta, {
        type: 'pageview:server',
        url: '/test',
        route: 'test',
        status: 404,
        timing: 5,
      });
    },
  };
  events.on('access-log', payload => mockLogger.info('access log', payload));
  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'pageview_server', 'logs the correct key');
      t.deepLooseEqual(
        tags,
        {route: 'not-found', status: 404},
        'logs the correct tags'
      );
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit(
    'pageview:server',
    {title: 'test', status: 404, timing: 5},
    {url: '/test'}
  );
  t.end();
});

tape('route timing - pageview:browser - 404 not found', t => {
  const events = new EventEmitter();
  t.plan(4);
  const mockLogger = {
    info(message, meta) {
      t.equal(message, 'access log');
      t.deepLooseEqual(meta, {
        type: 'pageview:browser',
        url: '/test',
        route: 'test',
        status: 404,
        timing: 5,
      });
    },
  };
  events.on('access-log', payload => mockLogger.info('access log', payload));
  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'pageview_browser', 'logs the correct key');
      t.deepLooseEqual(
        tags,
        {route: 'not-found', status: 404},
        'logs the correct tags'
      );
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit(
    'pageview:browser',
    {title: 'test', status: 404, timing: 5},
    {url: '/test'}
  );
  t.end();
});

tape('route timing - route_time', t => {
  const events = new EventEmitter();
  const mockLogger = {
    info() {},
  };
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
    },
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit('pageview:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
  t.end();
});

tape('route timing - render:server', t => {
  const mockLogger = {
    info() {},
  };
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
    },
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit('render:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
  t.end();
});

tape('route timing - route with invalid m3 characters', t => {
  const events = new EventEmitter();
  const mockLogger = {
    info() {},
  };
  const mockM3 = {
    increment() {},
    timing(key, value, tags) {
      t.equal(key, 'render_server', 'logs the correct key');
      t.equal(value, 5, 'logs the correct value');
      t.deepLooseEqual(
        tags,
        {
          route: '/__test-route__another-route__/__someUuid',
          status: 'test-status',
        },
        'logs the correct tags'
      );
    },
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit('render:server', {
    title: '/(test-route|another-route)/:someUuid',
    timing: 5,
    status: 'test-status',
  });
  t.end();
});
