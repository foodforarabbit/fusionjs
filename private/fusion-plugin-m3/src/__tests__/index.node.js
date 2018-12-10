// @flow
import tape from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {
  UniversalEventsToken,
  type UniversalEventsType,
} from 'fusion-plugin-universal-events';
import {M3Token, M3ClientToken, CommonTagsToken} from '../index';
import M3Plugin from '../server';

tape.test('m3 server plugin', t => {
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
  const events = (({
    on(type) {
      t.equal(type, `m3:${types.shift()}`, 'adds event handler correctly');
    },
  }: any): UniversalEventsType);
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
        'dev-service',
        'passes in common tag service'
      );
      t.equal(
        config.commonTags.scaffolded_web_app,
        true,
        'passes in common tag scaffolded_web_app'
      );
      t.equal(
        typeof config.commonTags.runtime,
        'string',
        'passes in common tag runtime'
      );
      t.equal(config.commonTags.a, 'a', 'allows passing in commonTags config');
    }
    counter(key, value, {tags}) {
      flags.counter = true;
      t.equal(key, 'key', 'counter passes key through');
      t.equal(value, 100, 'counter passes value through');
      t.looseEqual(tags, {tags: 'tags'}, 'counter passes tags through');
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      t.equal(key, 'key', 'increment passes key through');
      t.equal(value, 1, 'increment calls with value 1');
      t.looseEqual(tags, {tags: 'tags'}, 'increment passes tags through');
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      t.equal(key, 'key', 'decrement passes key through');
      t.equal(value, 1, 'decrement calls with value 1');
      t.looseEqual(tags, {tags: 'tags'}, 'decrement passes tags through');
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      t.equal(key, 'key', 'timing passes key through');
      t.equal(value, 100, 'timing passes value through');
      t.looseEqual(tags, {tags: 'tags'}, 'timing passes tags through');
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      t.equal(key, 'key', 'gauge passes key through');
      t.equal(value, 100, 'gauge passes value through');
      t.looseEqual(tags, {tags: 'tags'}, 'gauge passes tags through');
    }
    scope(arg) {
      flags.scope = true;
      t.equal(arg, 'test', 'scope passes through arguments');
    }
    immediateCounter(key, value, {tags}) {
      flags.immediateCounter = true;
      t.equal(key, 'key', 'immediateCounter passes key through');
      t.equal(value, 100, 'immediateCounter passes value through');
      t.looseEqual(
        tags,
        {tags: 'tags'},
        'immediateCounter passes tags through'
      );
    }
    immediateIncrement(key, value, {tags}) {
      flags.immediateIncrement = true;
      t.equal(key, 'key', 'immediateIncrement passes key through');
      t.equal(value, 1, 'immediateIncrement uses 1 as value');
      t.looseEqual(
        tags,
        {tags: 'tags'},
        'immediateIncrement passes tags through'
      );
    }
    immediateDecrement(key, value, {tags}) {
      flags.immediateDecrement = true;
      t.equal(key, 'key', 'immediateDecrement passes key through');
      t.equal(value, 1, 'immediateDecrement uses 1 as value');
      t.looseEqual(
        tags,
        {tags: 'tags'},
        'immediateDecrement passes tags through'
      );
    }
    immediateTiming(key, value, {tags}) {
      flags.immediateTiming = true;
      t.equal(key, 'key', 'immediateTiming passes key through');
      t.equal(value, 100, 'immediateTiming passes value through');
      t.looseEqual(tags, {tags: 'tags'}, 'immediateTiming passes tags through');
    }
    immediateGauge(key, value, {tags}) {
      flags.immediateGauge = true;
      t.equal(key, 'key', 'immediateGauge passes key through');
      t.equal(value, 100, 'immediateGauge passes value through');
      t.looseEqual(tags, {tags: 'tags'}, 'immediateGauge passes tags through');
    }
    close(arg) {
      flags.close = true;
      t.equal(arg, 'test', 'close passes through arguments');
    }
  }
  const app = new App('el', el => el);
  app.register(M3ClientToken, Client);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, events);
  app.register(CommonTagsToken, {a: 'a'});
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.counter('key', 100, {tags: 'tags'});
    m3.increment('key', {tags: 'tags'});
    m3.decrement('key', {tags: 'tags'});
    m3.timing('key', 100, {tags: 'tags'});
    m3.gauge('key', 100, {tags: 'tags'});
    m3.scope('test');
    m3.immediateCounter('key', 100, {tags: 'tags'});
    m3.immediateIncrement('key', {tags: 'tags'});
    m3.immediateDecrement('key', {tags: 'tags'});
    m3.immediateTiming('key', 100, {tags: 'tags'});
    m3.immediateGauge('key', 100, {tags: 'tags'});
    m3.close('test');
    return (ctx, next) => next();
  });
  getSimulator(app);
  t.ok(flags.counter, 'calls counter');
  t.ok(flags.increment, 'calls increment');
  t.ok(flags.decrement, 'calls decrement');
  t.ok(flags.timing, 'calls timing');
  t.ok(flags.gauge, 'calls gauge');
  t.ok(flags.scope, 'calls scope');
  t.ok(flags.immediateCounter, 'calls immediateCounter');
  t.ok(flags.immediateIncrement, 'calls immediateIncrement');
  t.ok(flags.immediateDecrement, 'calls immediateDecrement');
  t.ok(flags.immediateTiming, 'calls immediateTiming');
  t.ok(flags.immediateGauge, 'calls immediateGauge');
  t.ok(flags.close, 'calls close');
  t.end();
});

tape.test('m3 server plugin - event handlers', t => {
  const types = ['counter', 'increment', 'decrement', 'timing', 'gauge'];
  let flags = {
    counter: false,
    increment: false,
    decrement: false,
    timing: false,
    gauge: false,
  };
  const events = (({
    on(type, handler) {
      const m3Type = types.shift();
      t.equal(type, `m3:${m3Type}`, 'adds event handler correctly');
      t.equal(typeof handler, 'function', 'passes a function handler');
      handler({
        key: `${m3Type}-key`,
        value: 'value',
        tags: {something: 'value'},
      });
    },
  }: any): UniversalEventsType);

  class Client {
    counter(key, value, {tags}) {
      flags.counter = true;
      t.equal(key, 'counter-key', 'counter passes key through');
      t.equal(value, 'value', 'counter passes value through');
      t.deepLooseEqual(
        tags,
        {something: 'value'},
        'counter passes tags through'
      );
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      t.equal(key, 'increment-key', 'increment passes key through');
      t.equal(value, 1, 'increment calls with value 1');
      t.deepLooseEqual(
        tags,
        {something: 'value'},
        'increment passes tags through'
      );
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      t.equal(key, 'decrement-key', 'decrement passes key through');
      t.equal(value, 1, 'decrement calls with value 1');
      t.deepLooseEqual(
        tags,
        {something: 'value'},
        'decrement passes tags through'
      );
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      t.equal(key, 'timing-key', 'timing passes key through');
      t.equal(value, 'value', 'timing passes value through');
      t.deepLooseEqual(
        tags,
        {something: 'value'},
        'timing passes tags through'
      );
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      t.equal(key, 'gauge-key', 'gauge passes key through');
      t.equal(value, 'value', 'gauge passes value through');
      t.deepLooseEqual(tags, {something: 'value'}, 'gauge passes tags through');
    }
    scope() {}
    immediateCounter() {}
    immediateIncrement() {}
    immediateDecrement() {}
    immediateTiming() {}
    immediateGauge() {}
    close() {}
  }
  const app = new App('el', el => el);
  app.register(M3ClientToken, Client);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, events);
  app.register(CommonTagsToken, {a: 'a'});
  getSimulator(app);
  t.ok(flags.counter, 'calls counter');
  t.ok(flags.increment, 'calls increment');
  t.ok(flags.decrement, 'calls decrement');
  t.ok(flags.timing, 'calls timing');
  t.ok(flags.gauge, 'calls gauge');
  t.end();
});

tape.test('m3 server plugin - event handlers with __url__', t => {
  const types = ['counter', 'increment', 'decrement', 'timing', 'gauge'];
  let flags = {
    counter: false,
    increment: false,
    decrement: false,
    timing: false,
    gauge: false,
  };
  const events = (({
    emit() {},
    on(type, handler) {
      const m3Type = types.shift();
      t.equal(type, `m3:${m3Type}`, 'adds event handler correctly');
      t.equal(typeof handler, 'function', 'passes a function handler');
      handler({
        key: `${m3Type}-key`,
        value: 'value',
        tags: {something: 'value'},
        __url__: '/test',
      });
    },
  }: any): UniversalEventsType);

  class Client {
    counter(key, value, {tags}) {
      flags.counter = true;
      t.equal(key, 'counter-key', 'counter passes key through');
      t.equal(value, 'value', 'counter passes value through');
      t.deepLooseEqual(
        tags,
        {route: '/test', something: 'value'},
        'counter passes tags through'
      );
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      t.equal(key, 'increment-key', 'increment passes key through');
      t.equal(value, 1, 'increment calls with value 1');
      t.deepLooseEqual(
        tags,
        {route: '/test', something: 'value'},
        'increment passes tags through'
      );
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      t.equal(key, 'decrement-key', 'decrement passes key through');
      t.equal(value, 1, 'decrement calls with value 1');
      t.deepLooseEqual(
        tags,
        {route: '/test', something: 'value'},
        'decrement passes tags through'
      );
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      t.equal(key, 'timing-key', 'timing passes key through');
      t.equal(value, 'value', 'timing passes value through');
      t.deepLooseEqual(
        tags,
        {route: '/test', something: 'value'},
        'timing passes tags through'
      );
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      t.equal(key, 'gauge-key', 'gauge passes key through');
      t.equal(value, 'value', 'gauge passes value through');
      t.deepLooseEqual(
        tags,
        {route: '/test', something: 'value'},
        'gauge passes tags through'
      );
    }
    scope() {}
    immediateCounter() {}
    immediateIncrement() {}
    immediateDecrement() {}
    immediateTiming() {}
    immediateGauge() {}
    close() {}
  }
  const app = new App('el', el => el);
  app.register(M3ClientToken, Client);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, events);
  app.register(CommonTagsToken, {a: 'a'});
  getSimulator(app);
  t.ok(flags.counter, 'calls counter');
  t.ok(flags.increment, 'calls increment');
  t.ok(flags.decrement, 'calls decrement');
  t.ok(flags.timing, 'calls timing');
  t.ok(flags.gauge, 'calls gauge');
  t.end();
});

tape.test('m3 server plugin - event handlers with __url__ and no tags', t => {
  const types = ['counter', 'increment', 'decrement', 'timing', 'gauge'];
  let flags = {
    counter: false,
    increment: false,
    decrement: false,
    timing: false,
    gauge: false,
  };
  const events = (({
    on(type, handler) {
      const m3Type = types.shift();
      t.equal(type, `m3:${m3Type}`, 'adds event handler correctly');
      t.equal(typeof handler, 'function', 'passes a function handler');
      handler({
        key: `${m3Type}-key`,
        value: 'value',
        __url__: '/test',
      });
    },
  }: any): UniversalEventsType);

  class Client {
    counter(key, value, {tags}) {
      flags.counter = true;
      t.equal(key, 'counter-key', 'counter passes key through');
      t.equal(value, 'value', 'counter passes value through');
      t.deepLooseEqual(tags, {route: '/test'}, 'counter passes tags through');
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      t.equal(key, 'increment-key', 'increment passes key through');
      t.equal(value, 1, 'increment calls with value 1');
      t.deepLooseEqual(tags, {route: '/test'}, 'increment passes tags through');
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      t.equal(key, 'decrement-key', 'decrement passes key through');
      t.equal(value, 1, 'decrement calls with value 1');
      t.deepLooseEqual(tags, {route: '/test'}, 'decrement passes tags through');
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      t.equal(key, 'timing-key', 'timing passes key through');
      t.equal(value, 'value', 'timing passes value through');
      t.deepLooseEqual(tags, {route: '/test'}, 'timing passes tags through');
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      t.equal(key, 'gauge-key', 'gauge passes key through');
      t.equal(value, 'value', 'gauge passes value through');
      t.deepLooseEqual(tags, {route: '/test'}, 'gauge passes tags through');
    }
    scope() {}
    immediateCounter() {}
    immediateIncrement() {}
    immediateDecrement() {}
    immediateTiming() {}
    immediateGauge() {}
    close() {}
  }
  const app = new App('el', el => el);
  app.register(M3ClientToken, Client);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, events);
  app.register(CommonTagsToken, {a: 'a'});
  getSimulator(app);
  t.ok(flags.counter, 'calls counter');
  t.ok(flags.increment, 'calls increment');
  t.ok(flags.decrement, 'calls decrement');
  t.ok(flags.timing, 'calls timing');
  t.ok(flags.gauge, 'calls gauge');
  t.end();
});
