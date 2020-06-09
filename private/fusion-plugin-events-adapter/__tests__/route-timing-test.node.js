// @flow
import EventEmitter from './custom-event-emitter.js';
import routeTiming from '../src/handlers/route-timing';
import {M3_ROUTE_METRICS_VERSION as version} from '../src/utils/constants';

test('route timing - pageview:server', () => {
  const events = new EventEmitter();
  expect.assertions(4);
  const mockLogger = {
    info(message, meta) {
      expect(message).toBe('access log');
      expect(meta).toStrictEqual({
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
      expect(key).toBe('pageview_server');
      expect(tags).toStrictEqual({route: 'test', status: 200, version}); // 'logs the correct tags'
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit(
    'pageview:server',
    {title: 'test', status: 200, timing: 5, version},
    {url: '/test'}
  );
});

test('route timing - pageview:browser', () => {
  expect.assertions(4);
  const events = new EventEmitter();
  const mockLogger = {
    info(message, meta) {
      expect(message).toBe('access log');
      expect(meta).toStrictEqual({
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
      expect(key).toBe('pageview_browser');
      expect(tags).toStrictEqual({
        route: 'test',
        status: 200,
        version,
      }); // 'logs the correct tags'
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});
  events.emit('pageview:browser', {title: 'test', status: 200}, {url: '/test'});
});

test('route timing - pageview:server - 404 not found', () => {
  expect.assertions(4);
  const events = new EventEmitter();
  const mockLogger = {
    info(message, meta) {
      expect(message).toBe('access log');
      expect(meta).toStrictEqual({
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
      expect(key).toBe('pageview_server');
      expect(tags).toStrictEqual({route: 'not-found', status: 404, version}); // 'logs the correct tags'
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit(
    'pageview:server',
    {title: 'test', status: 404, timing: 5},
    {url: '/test'}
  );
});

test('route timing - pageview:browser - 404 not found', () => {
  const events = new EventEmitter();
  expect.assertions(4);
  const mockLogger = {
    info(message, meta) {
      expect(message).toBe('access log');
      expect(meta).toStrictEqual({
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
      expect(key).toBe('pageview_browser');
      expect(tags).toStrictEqual({route: 'not-found', status: 404, version}); // 'logs the correct tags'
    },
    timing() {},
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit(
    'pageview:browser',
    {title: 'test', status: 404, timing: 5},
    {url: '/test'}
  );
});

test('route timing - route_time', () => {
  const events = new EventEmitter();
  const mockLogger = {
    info() {},
  };
  const mockM3 = {
    increment() {},
    timing(key, value, tags) {
      expect(key).toBe('route_time');
      expect(value).toBe(5);
      expect(tags).toStrictEqual({
        route: 'test-route',
        status: 'test-status',
        version,
      }); // 'logs the correct tags'
    },
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit('pageview:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});

test('route timing - render:server', () => {
  const mockLogger = {
    info() {},
  };
  const events = new EventEmitter();
  const mockM3 = {
    increment() {},
    timing(key, value, tags) {
      expect(key).toBe('render_server');
      expect(value).toBe(5);
      expect(tags).toStrictEqual({
        route: 'test-route',
        status: 'test-status',
        version,
      }); // 'logs the correct tags'
    },
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit('render:server', {
    title: 'test-route',
    timing: 5,
    status: 'test-status',
  });
});

test('route timing - route with invalid m3 characters', () => {
  const events = new EventEmitter();
  const mockLogger = {
    info() {},
  };
  const mockM3 = {
    increment() {},
    timing(key, value, tags) {
      expect(key).toBe('render_server');
      expect(value).toBe(5);
      expect(tags).toStrictEqual({
        route: '/__test-route__another-route__/__someUuid',
        status: 'test-status',
        version,
      }); // 'logs the correct tags'
    },
  };

  routeTiming({events, m3: mockM3, logger: mockLogger});

  events.emit('render:server', {
    title: '/(test-route|another-route)/:someUuid',
    timing: 5,
    status: 'test-status',
  });
});
