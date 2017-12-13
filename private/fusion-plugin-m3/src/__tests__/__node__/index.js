import tape from 'tape-cup';
import M3Plugin from '../../server';

tape('m3 server plugin required parameters', t => {
  t.throws(() => {
    M3Plugin({UniversalEvents: {}});
  }, /parameter is required/);
  t.throws(() => {
    M3Plugin({service: ''});
  }, /parameter is required/);
  t.end();
});
tape('m3 server plugin', t => {
  const types = ['counter', 'increment', 'decrement', 'timing', 'gauge'];
  let flags = {
    counter: false,
    increment: false,
    decrement: false,
    timing: false,
    gauge: false,
    scope: false,
    immediateCounter: false,
    immediateIncrement: false,
    immediateDecrement: false,
    immediateTiming: false,
    immediateGauge: false,
    close: false,
  };
  const events = {
    of() {
      return {
        on(type) {
          t.equal(type, `m3:${types.shift()}`, 'adds event handler correctly');
        },
      };
    },
  };
  class Client {
    constructor(config) {
      t.equal(typeof config.commonTags.dc, 'string', 'passes in common tag dc');
      t.equal(
        typeof config.commonTags.deployment,
        'string',
        'passes in common tag deployment'
      );
      t.equal(
        config.commonTags.service,
        'app-name',
        'passes in common tag service'
      );
      t.equal(
        config.commonTags.scaffolded_web_app,
        true,
        'passes in common tag scaffolded_web_app'
      );
      t.equal(config.commonTags.a, 'a', 'allows passing in commonTags config');
    }
    counter(key, value, {tags}) {
      flags.counter = true;
      t.equal(key, 'key', 'counter passes key through');
      t.equal(value, 'value', 'counter passes value through');
      t.equal(tags, 'tags', 'counter passes tags through');
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      t.equal(key, 'key', 'increment passes key through');
      t.equal(value, 1, 'increment calls with value 1');
      t.equal(tags, 'tags', 'increment passes tags through');
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      t.equal(key, 'key', 'decrement passes key through');
      t.equal(value, 1, 'decrement calls with value 1');
      t.equal(tags, 'tags', 'decrement passes tags through');
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      t.equal(key, 'key', 'timing passes key through');
      t.equal(value, 'value', 'timing passes value through');
      t.equal(tags, 'tags', 'timing passes tags through');
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      t.equal(key, 'key', 'gauge passes key through');
      t.equal(value, 'value', 'gauge passes value through');
      t.equal(tags, 'tags', 'gauge passes tags through');
    }
    scope(arg) {
      flags.scope = true;
      t.equal(arg, 'test', 'scope passes through arguments');
    }
    immediateCounter(key, value, {tags}) {
      flags.immediateCounter = true;
      t.equal(key, 'key', 'immediateCounter passes key through');
      t.equal(value, 'value', 'immediateCounter passes value through');
      t.equal(tags, 'tags', 'immediateCounter passes tags through');
    }
    immediateIncrement(key, value, {tags}) {
      flags.immediateIncrement = true;
      t.equal(key, 'key', 'immediateIncrement passes key through');
      t.equal(value, 1, 'immediateIncrement uses 1 as value');
      t.equal(tags, 'tags', 'immediateIncrement passes tags through');
    }
    immediateDecrement(key, value, {tags}) {
      flags.immediateDecrement = true;
      t.equal(key, 'key', 'immediateDecrement passes key through');
      t.equal(value, 1, 'immediateDecrement uses 1 as value');
      t.equal(tags, 'tags', 'immediateDecrement passes tags through');
    }
    immediateTiming(key, value, {tags}) {
      flags.immediateTiming = true;
      t.equal(key, 'key', 'immediateTiming passes key through');
      t.equal(value, 'value', 'immediateTiming passes value through');
      t.equal(tags, 'tags', 'immediateTiming passes tags through');
    }
    immediateGauge(key, value, {tags}) {
      flags.immediateGauge = true;
      t.equal(key, 'key', 'immediateGauge passes key through');
      t.equal(value, 'value', 'immediateGauge passes value through');
      t.equal(tags, 'tags', 'immediateGauge passes tags through');
    }
    close(arg) {
      flags.close = true;
      t.equal(arg, 'test', 'close passes through arguments');
    }
  }
  const m3 = M3Plugin({
    UniversalEvents: events,
    Client,
    service: 'app-name',
    commonTags: {a: 'a'},
  }).of();
  m3.counter('key', 'value', 'tags');
  m3.increment('key', 'tags');
  m3.decrement('key', 'tags');
  m3.timing('key', 'value', 'tags');
  m3.gauge('key', 'value', 'tags');
  m3.scope('test');
  m3.immediateCounter('key', 'value', 'tags');
  m3.immediateIncrement('key', 'tags');
  m3.immediateDecrement('key', 'tags');
  m3.immediateTiming('key', 'value', 'tags');
  m3.immediateGauge('key', 'value', 'tags');
  m3.close('test');
  t.ok(flags.counter);
  t.ok(flags.increment);
  t.ok(flags.decrement);
  t.ok(flags.timing);
  t.ok(flags.gauge);
  t.ok(flags.scope);
  t.ok(flags.immediateCounter);
  t.ok(flags.immediateIncrement);
  t.ok(flags.immediateDecrement);
  t.ok(flags.immediateTiming);
  t.ok(flags.immediateGauge);
  t.ok(flags.close);
  t.end();
});
