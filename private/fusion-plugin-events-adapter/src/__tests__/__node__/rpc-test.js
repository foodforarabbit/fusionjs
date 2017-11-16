// @flow
import tape from 'tape-cup';
import rpc from '../../handlers/rpc';
import M3 from '../../emitters/m3';
import Logger from '../../emitters/logger';
import EventEmitter from 'events';

tape('rpc error handlers', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  const log = Logger(events);
  const e = new Error('fail');
  rpc(events, m3, log);
  let emittedIncrement = false;
  let emittedLog = false;
  events.on('m3:increment', args => {
    t.equal(args.key, 'rpc_missing_handler');
    t.deepLooseEqual(args.tags, {origin: 'server'});
    emittedIncrement = true;
  });
  events.on('logtron:log', payload => {
    emittedLog = true;
    t.equal(payload.level, 'error');
    t.equal(payload.message, e.message);
    t.equal(payload.meta, e);
  });
  events.emit('rpc:error', {origin: 'server', error: e});
  t.ok(emittedIncrement, 'emits stat');
  t.ok(emittedLog, 'emits log');
  t.end();
});

tape('rpc method success', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  const log = Logger(events);
  rpc(events, m3, log);
  let emittedIncrement = false;
  events.on('m3:timing', args => {
    t.equal(args.key, 'web_rpc_method');
    t.equal(args.value, 5);
    t.deepLooseEqual(args.tags, {
      origin: 'server',
      rpc_id: 'test',
      status: 'success',
    });
    emittedIncrement = true;
  });
  events.emit('rpc:method', {
    method: 'test',
    origin: 'server',
    timing: 5,
    status: 'success',
  });
  t.ok(emittedIncrement, 'emits stat');
  t.end();
});

tape('rpc method failure', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  const log = Logger(events);
  rpc(events, m3, log);
  let emittedIncrement = false;
  let emittedLog = false;
  const e = new Error('fail');
  events.on('m3:timing', args => {
    t.equal(args.key, 'web_rpc_method');
    t.equal(args.value, 5);
    t.deepLooseEqual(args.tags, {
      origin: 'server',
      rpc_id: 'test',
      status: 'failure',
    });
    emittedIncrement = true;
  });
  events.on('logtron:log', payload => {
    emittedLog = true;
    t.equal(payload.level, 'error');
    t.equal(payload.message, e.message);
    t.equal(payload.meta, e);
  });
  events.emit('rpc:method', {
    method: 'test',
    origin: 'server',
    timing: 5,
    status: 'failure',
    error: e,
  });
  t.ok(emittedIncrement, 'emits stat');
  t.ok(emittedLog, 'emits log');
  t.end();
});
