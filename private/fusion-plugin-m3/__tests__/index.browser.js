// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {
  UniversalEventsToken,
  type UniversalEventsType,
} from 'fusion-plugin-universal-events';
import M3Plugin from '../src/browser';
import {M3Token} from '../src/index';

test('browser m3 counter', done => {
  const UniversalEvents = (({
    emit(type, {key, value, tags}) {
      expect(type).toBe('m3:counter');
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
      done();
    },
  }: any): UniversalEventsType);
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.counter('key', 100, {tags: 'tags'});
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('browser m3 timing', done => {
  const UniversalEvents = (({
    emit(type, {key, value, tags}) {
      expect(type).toBe('m3:timing');
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
      done();
    },
  }: any): UniversalEventsType);
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.timing('key', 100, {tags: 'tags'});
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('browser m3 timing with date', done => {
  const UniversalEvents = (({
    emit(type, {key, value, tags}) {
      expect(type).toBe('m3:timing');
      expect(key).toBe('key');
      expect(typeof value).toBe('number');
      expect(value >= 10 && value < 20).toBeTruthy();
      expect(tags).toStrictEqual({tags: 'tags'});
      done();
    },
  }: any): UniversalEventsType);
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    const start = new Date();
    setTimeout(() => {
      m3.timing('key', start, {tags: 'tags'});
    }, 10);
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('browser m3 gauge', done => {
  const UniversalEvents = (({
    emit(type, {key, value, tags}) {
      expect(type).toBe('m3:gauge');
      expect(key).toBe('key');
      expect(value).toBe(100);
      expect(tags).toStrictEqual({tags: 'tags'});
      done();
    },
  }: any): UniversalEventsType);

  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.gauge('key', 100, {tags: 'tags'});
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('browser m3 increment', done => {
  const UniversalEvents = (({
    emit(type, {key, tags}) {
      expect(type).toBe('m3:increment');
      expect(key).toBe('key');
      expect(tags).toStrictEqual({tags: 'tags'});
      done();
    },
  }: any): UniversalEventsType);

  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.increment('key', {tags: 'tags'});
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('browser m3 decrement', done => {
  const UniversalEvents = (({
    emit(type, {key, tags}) {
      expect(type).toBe('m3:decrement');
      expect(key).toBe('key');
      expect(tags).toStrictEqual({tags: 'tags'});
      done();
    },
  }: any): UniversalEventsType);
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.decrement('key', {tags: 'tags'});
    return (ctx, next) => next();
  });
  getSimulator(app);
});
