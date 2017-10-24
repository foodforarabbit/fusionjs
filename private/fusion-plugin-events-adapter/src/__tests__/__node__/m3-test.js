import tape from 'tape-cup';
import M3 from '../../emitters/m3';

tape('m3 emitter interface', t => {
  t.equal(typeof M3, 'function', 'exports a function');
  const events = {
    emit() {},
  };
  const m3 = M3(events);
  t.equal(typeof m3.increment, 'function', 'exposes an increment function');
  t.equal(typeof m3.decrement, 'function', 'exposes an decrement function');
  t.equal(typeof m3.gauge, 'function', 'exposes an gauge function');
  t.equal(typeof m3.counter, 'function', 'exposes an counter function');
  t.equal(typeof m3.timing, 'function', 'exposes an timing function');
  t.end();
});

tape('m3 emitter increment', t => {
  const events = {
    emit(type, payload) {
      t.equal(type, 'm3:increment', 'emits increment event with correct type');
      t.equal(payload, 'test', 'increment passes payload through');
      t.end();
    },
  };
  const m3 = M3(events);
  m3.increment('test');
});

tape('m3 emitter decrement', t => {
  const events = {
    emit(type, payload) {
      t.equal(type, 'm3:decrement', 'emits decrement event with correct type');
      t.equal(payload, 'test', 'decrement passes payload through');
      t.end();
    },
  };
  const m3 = M3(events);
  m3.decrement('test');
});

tape('m3 emitter timing', t => {
  const events = {
    emit(type, payload) {
      t.equal(type, 'm3:timing', 'emits timing event with correct type');
      t.equal(payload, 'test', 'timing passes payload through');
      t.end();
    },
  };
  const m3 = M3(events);
  m3.timing('test');
});

tape('m3 emitter counter', t => {
  const events = {
    emit(type, payload) {
      t.equal(type, 'm3:counter', 'emits counter event with correct type');
      t.equal(payload, 'test', 'counter passes payload through');
      t.end();
    },
  };
  const m3 = M3(events);
  m3.counter('test');
});

tape('m3 emitter gauge', t => {
  const events = {
    emit(type, payload) {
      t.equal(type, 'm3:gauge', 'emits gauge event with correct type');
      t.equal(payload, 'test', 'gauge passes payload through');
      t.end();
    },
  };
  const m3 = M3(events);
  m3.gauge('test');
});
