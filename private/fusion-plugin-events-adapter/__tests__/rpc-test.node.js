// @flow
import EventEmitter from './custom-event-emitter.js';
import rpc from '../src/handlers/rpc';

test('rpc error handlers', () => {
  const events = new EventEmitter();
  const e = new Error('fail');

  const mockM3 = {
    increment(key, tags) {
      expect(key).toBe('rpc_missing_handler');
      expect(tags).toStrictEqual({origin: 'server'});
    },
  };

  const mockLogger = {
    error(message, meta) {
      expect(message).toBe(e.message);
      expect(meta).toBe(e);
    },
  };

  rpc({events, m3: mockM3, logger: mockLogger});
  events.emit('rpc:error', {origin: 'server', error: e});
});

test('rpc method success', () => {
  const events = new EventEmitter();

  const mockM3 = {
    timing(key, value, tags) {
      expect(key).toBe('web_rpc_method');
      expect(value).toBe(5);
      expect(tags).toStrictEqual({
        origin: 'server',
        rpc_id: 'test',
        status: 'success',
      });
    },
  };

  const mockLogger = {};

  rpc({events, m3: mockM3, logger: mockLogger});
  events.emit('rpc:method', {
    method: 'test',
    origin: 'server',
    timing: 5,
    status: 'success',
  });
});

test('rpc method failure', () => {
  const events = new EventEmitter();
  const e = new Error('fail');

  const mockM3 = {
    timing(key, value, tags) {
      expect(key).toBe('web_rpc_method');
      expect(value).toBe(5);
      expect(tags).toStrictEqual({
        origin: 'server',
        rpc_id: 'test',
        status: 'failure',
      });
    },
  };

  const mockLogger = {
    error(message, meta) {
      expect(message).toBe(e.message);
      expect(meta).toBe(e);
    },
  };

  rpc({events, m3: mockM3, logger: mockLogger});
  events.emit('rpc:method', {
    method: 'test',
    origin: 'server',
    timing: 5,
    status: 'failure',
    error: e,
  });
});
