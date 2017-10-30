import tape from 'tape-cup';
import M3Plugin from '../../server';

tape('m3 server plugin required parameters', t => {
  t.throws(() => {
    M3Plugin({UniversalEvents: {}});
  }, /parameter is required/);
  t.throws(() => {
    M3Plugin({appName: ''});
  }, /parameter is required/);
  t.end();
});
tape('m3 server plugin', t => {
  t.plan(31);
  const types = ['counter', 'increment', 'decrement', 'timing', 'gauge'];
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
      t.equal(key, 'key', 'counter passes key through');
      t.equal(value, 'value', 'counter passes value through');
      t.equal(tags, 'tags', 'counter passes tags through');
    }
    increment(key, value, {tags}) {
      t.equal(key, 'key', 'increment passes key through');
      t.equal(value, 1, 'increment calls with value 1');
      t.equal(tags, 'tags', 'increment passes tags through');
    }
    decrement(key, value, {tags}) {
      t.equal(key, 'key', 'decrement passes key through');
      t.equal(value, 1, 'decrement calls with value 1');
      t.equal(tags, 'tags', 'decrement passes tags through');
    }
    timing(key, value, {tags}) {
      t.equal(key, 'key', 'timing passes key through');
      t.equal(value, 'value', 'timing passes value through');
      t.equal(tags, 'tags', 'timing passes tags through');
    }
    gauge(key, value, {tags}) {
      t.equal(key, 'key', 'gauge passes key through');
      t.equal(value, 'value', 'gauge passes value through');
      t.equal(tags, 'tags', 'gauge passes tags through');
    }
    scope(arg) {
      t.equal(arg, 'test', 'scope passes through arguments');
    }
    immediateIncrement(arg) {
      t.equal(arg, 'test', 'immediateIncrement passes through arguments');
    }
    immediateDecrement(arg) {
      t.equal(arg, 'test', 'immediateDecrement passes through arguments');
    }
    immediateTiming(arg) {
      t.equal(arg, 'test', 'immediateTiming passes through arguments');
    }
    immediateGauge(arg) {
      t.equal(arg, 'test', 'immediateGauge passes through arguments');
    }
    close(arg) {
      t.equal(arg, 'test', 'close passes through arguments');
    }
  }
  const m3 = M3Plugin({
    UniversalEvents: events,
    Client,
    appName: 'app-name',
    commonTags: {a: 'a'},
  }).of();
  m3.counter('key', 'value', 'tags');
  m3.increment('key', 'tags');
  m3.decrement('key', 'tags');
  m3.timing('key', 'value', 'tags');
  m3.gauge('key', 'value', 'tags');
  m3.scope('test');
  m3.immediateIncrement('test');
  m3.immediateDecrement('test');
  m3.immediateTiming('test');
  m3.immediateGauge('test');
  m3.close('test');
  t.end();
});
