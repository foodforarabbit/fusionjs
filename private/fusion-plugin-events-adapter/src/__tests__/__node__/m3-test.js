// @flow
import tape from 'tape-cup';
import M3 from '../../emitters/m3';
import EventEmitter from 'events';

tape('m3 emitter interface', t => {
  t.equal(typeof M3, 'function', 'exports a function');
  const m3 = M3(new EventEmitter());
  t.equal(typeof m3.increment, 'function', 'exposes an increment function');
  t.equal(typeof m3.decrement, 'function', 'exposes an decrement function');
  t.equal(typeof m3.gauge, 'function', 'exposes an gauge function');
  t.equal(typeof m3.counter, 'function', 'exposes an counter function');
  t.equal(typeof m3.timing, 'function', 'exposes an timing function');
  t.end();
});

tape('m3 emitter increment', t => {
  class Events extends EventEmitter {
    emit(type, payload) {
      t.equal(type, 'm3:increment', 'emits increment event with correct type');
      t.equal(payload.key, 'test', 'increment passes payload through');
      t.deepLooseEqual(payload.tags, {});
      t.end();
    }
  }
  const m3 = M3(new Events());
  m3.increment({key: 'test', tags: {}});
});

tape('m3 emitter decrement', t => {
  class Events extends EventEmitter {
    emit(type, payload) {
      t.equal(type, 'm3:decrement', 'emits decrement event with correct type');
      t.equal(payload.key, 'test', 'decrement passes payload through');
      t.deepLooseEqual(payload.tags, {});
      t.end();
    }
  }
  const m3 = M3(new Events());
  m3.decrement({key: 'test', tags: {}});
});

tape('m3 emitter timing', t => {
  class Events extends EventEmitter {
    emit(type, payload) {
      t.equal(type, 'm3:timing', 'emits timing event with correct type');
      t.equal(payload.key, 'test', 'timing passes payload through');
      t.deepLooseEqual(payload.tags, {});
      t.equal(payload.value, 5);
      t.end();
    }
  }
  const m3 = M3(new Events());
  m3.timing({key: 'test', tags: {}, value: 5});
});

tape('m3 emitter counter', t => {
  class Events extends EventEmitter {
    emit(type, payload) {
      t.equal(type, 'm3:counter', 'emits counter event with correct type');
      t.equal(payload.key, 'test', 'counter passes payload through');
      t.deepLooseEqual(payload.tags, {});
      t.equal(payload.value, 5);
      t.end();
    }
  }
  const m3 = M3(new Events());
  m3.counter({key: 'test', tags: {}, value: 5});
});

tape('m3 emitter gauge', t => {
  class Events extends EventEmitter {
    emit(type, payload) {
      t.equal(type, 'm3:gauge', 'emits gauge event with correct type');
      t.equal(payload.key, 'test', 'gauge passes payload through');
      t.deepLooseEqual(payload.tags, {});
      t.equal(payload.value, 5);
      t.end();
    }
  }
  const m3 = M3(new Events());
  m3.gauge({key: 'test', tags: {}, value: 5});
});
