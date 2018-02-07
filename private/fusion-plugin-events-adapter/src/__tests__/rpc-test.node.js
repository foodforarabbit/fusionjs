// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';
import rpc from '../handlers/rpc';

tape('rpc error handlers', t => {
  const events = new EventEmitter();
  const e = new Error('fail');

  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'rpc_missing_handler');
      t.deepLooseEqual(tags, {origin: 'server'});
      t.pass('m3 incremented');
    },
  };

  const mockLogger = {
    error(message, meta) {
      t.pass('logger.error()');
      t.equal(message, e.message);
      t.equal(meta, e);
    },
  };

  rpc({events, m3: mockM3, logger: mockLogger});
  events.emit('rpc:error', {origin: 'server', error: e});
  t.end();
});

tape('rpc method success', t => {
  const events = new EventEmitter();

  const mockM3 = {
    timing(key, value, tags) {
      t.pass('m3.timing()');
      t.equal(key, 'web_rpc_method');
      t.equal(value, 5);
      t.deepLooseEqual(tags, {
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
  t.end();
});

tape('rpc method failure', t => {
  const events = new EventEmitter();
  const e = new Error('fail');

  const mockM3 = {
    timing(key, value, tags) {
      t.pass('m3.timing()');
      t.equal(key, 'web_rpc_method');
      t.equal(value, 5);
      t.deepLooseEqual(tags, {
        origin: 'server',
        rpc_id: 'test',
        status: 'failure',
      });
    },
  };

  const mockLogger = {
    error(message, meta) {
      t.pass('logger.error()');
      t.equal(message, e.message);
      t.equal(meta, e);
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
  t.end();
});
