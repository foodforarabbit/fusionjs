// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {
  UniversalEventsToken,
  type UniversalEventsType,
} from 'fusion-plugin-universal-events';
import {M3Token, M3ClientToken, CommonTagsToken} from '../index';
import M3Plugin from '../server';

test('m3 server plugin', () => {
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
      expect(type).toBe(`m3:${types.shift()}`);
    },
  }: any): UniversalEventsType);
  class Client {
    constructor(config) {
      expect(typeof config.commonTags.dc).toBe('string');
      expect(typeof config.commonTags.deployment).toBe('string');
      expect(config.commonTags.service).toBe('dev-service');
      expect(config.commonTags.scaffolded_web_app).toBe(true);
      expect(typeof config.commonTags.runtime).toBe('string');
      expect(config.commonTags.a).toBe('a');
    }
    counter(key, value, {tags}) {
      flags.counter = true;
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      expect(key).toBe('key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      expect(key).toBe('key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    scope(arg) {
      flags.scope = true;
      expect(arg).toBe('test');
    }
    immediateCounter(key, value, {tags}) {
      flags.immediateCounter = true;
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    immediateIncrement(key, value, {tags}) {
      flags.immediateIncrement = true;
      expect(key).toBe('key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    immediateDecrement(key, value, {tags}) {
      flags.immediateDecrement = true;
      expect(key).toBe('key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    immediateTiming(key, value, {tags}) {
      flags.immediateTiming = true;
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    immediateGauge(key, value, {tags}) {
      flags.immediateGauge = true;
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
    }
    close(arg) {
      flags.close = true;
      expect(arg).toBe('test');
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
  expect(flags.counter).toBeTruthy();
  expect(flags.increment).toBeTruthy();
  expect(flags.decrement).toBeTruthy();
  expect(flags.timing).toBeTruthy();
  expect(flags.gauge).toBeTruthy();
  expect(flags.scope).toBeTruthy();
  expect(flags.immediateCounter).toBeTruthy();
  expect(flags.immediateIncrement).toBeTruthy();
  expect(flags.immediateDecrement).toBeTruthy();
  expect(flags.immediateTiming).toBeTruthy();
  expect(flags.immediateGauge).toBeTruthy();
  expect(flags.close).toBeTruthy();
});

test('m3 server plugin - event handlers', () => {
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
      expect(type).toBe(`m3:${m3Type}`);
      expect(typeof handler).toBe('function');
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
      expect(key).toBe('counter-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({something: 'value'});
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      expect(key).toBe('increment-key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({something: 'value'});
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      expect(key).toBe('decrement-key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({something: 'value'});
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      expect(key).toBe('timing-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({something: 'value'});
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      expect(key).toBe('gauge-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({something: 'value'});
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
  expect(flags.counter).toBeTruthy();
  expect(flags.increment).toBeTruthy();
  expect(flags.decrement).toBeTruthy();
  expect(flags.timing).toBeTruthy();
  expect(flags.gauge).toBeTruthy();
});

test('m3 server plugin - event handlers with __url__', () => {
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
      expect(type).toBe(`m3:${m3Type}`);
      expect(typeof handler).toBe('function');
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
      expect(key).toBe('counter-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({route: '/test', something: 'value'});
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      expect(key).toBe('increment-key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({route: '/test', something: 'value'});
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      expect(key).toBe('decrement-key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({route: '/test', something: 'value'});
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      expect(key).toBe('timing-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({route: '/test', something: 'value'});
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      expect(key).toBe('gauge-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({route: '/test', something: 'value'});
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
  expect(flags.counter).toBeTruthy();
  expect(flags.increment).toBeTruthy();
  expect(flags.decrement).toBeTruthy();
  expect(flags.timing).toBeTruthy();
  expect(flags.gauge).toBeTruthy();
});

test('m3 server plugin - event handlers with __url__ and no tags', () => {
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
      expect(type).toBe(`m3:${m3Type}`);
      expect(typeof handler).toBe('function');
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
      expect(key).toBe('counter-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({route: '/test'});
    }
    increment(key, value, {tags}) {
      flags.increment = true;
      expect(key).toBe('increment-key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({route: '/test'});
    }
    decrement(key, value, {tags}) {
      flags.decrement = true;
      expect(key).toBe('decrement-key');
      expect(value).toBe(1);
      expect(tags).toStrictEqual({route: '/test'});
    }
    timing(key, value, {tags}) {
      flags.timing = true;
      expect(key).toBe('timing-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({route: '/test'});
    }
    gauge(key, value, {tags}) {
      flags.gauge = true;
      expect(key).toBe('gauge-key');
      expect(value).toBe('value');
      expect(tags).toStrictEqual({route: '/test'});
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
  expect(flags.counter).toBeTruthy();
  expect(flags.increment).toBeTruthy();
  expect(flags.decrement).toBeTruthy();
  expect(flags.timing).toBeTruthy();
  expect(flags.gauge).toBeTruthy();
});
