import tape from 'tape-cup';
import M3Plugin from '../../browser';

tape('browser m3 counter', t => {
  const UniversalEvents = {
    of() {
      return {
        emit(type, {key, value, tags}) {
          t.equal(type, 'm3:counter', 'calls with correct event type');
          t.equal(key, 'key', 'counter passes key through');
          t.equal(value, 'value', 'counter passes value through');
          t.equal(tags, 'tags', 'counter passes tags through');
          t.end();
        },
      };
    },
  };
  const m3 = M3Plugin({UniversalEvents}).of();
  m3.counter('key', 'value', 'tags');
});

tape('browser m3 timing', t => {
  const UniversalEvents = {
    of() {
      return {
        emit(type, {key, value, tags}) {
          t.equal(type, 'm3:timing', 'calls with correct event type');
          t.equal(key, 'key', 'timing passes key through');
          t.equal(value, 'value', 'timing passes value through');
          t.equal(tags, 'tags', 'timing passes tags through');
          t.end();
        },
      };
    },
  };
  const m3 = M3Plugin({UniversalEvents}).of();
  m3.timing('key', 'value', 'tags');
});

tape('browser m3 gauge', t => {
  const UniversalEvents = {
    of() {
      return {
        emit(type, {key, value, tags}) {
          t.equal(type, 'm3:gauge', 'calls with correct event type');
          t.equal(key, 'key', 'gauge passes key through');
          t.equal(value, 'value', 'gauge passes value through');
          t.equal(tags, 'tags', 'gauge passes tags through');
          t.end();
        },
      };
    },
  };
  const m3 = M3Plugin({UniversalEvents}).of();
  m3.gauge('key', 'value', 'tags');
});

tape('browser m3 increment', t => {
  const UniversalEvents = {
    of() {
      return {
        emit(type, {key, tags}) {
          t.equal(type, 'm3:increment', 'calls with correct event type');
          t.equal(key, 'key', 'increment passes key through');
          t.equal(tags, 'tags', 'increment passes tags through');
          t.end();
        },
      };
    },
  };
  const m3 = M3Plugin({UniversalEvents}).of();
  m3.increment('key', 'tags');
});

tape('browser m3 decrement', t => {
  const UniversalEvents = {
    of() {
      return {
        emit(type, {key, tags}) {
          t.equal(type, 'm3:decrement', 'calls with correct event type');
          t.equal(key, 'key', 'decrement passes key through');
          t.equal(tags, 'tags', 'decrement passes tags through');
          t.end();
        },
      };
    },
  };
  const m3 = M3Plugin({UniversalEvents}).of();
  m3.decrement('key', 'tags');
});
