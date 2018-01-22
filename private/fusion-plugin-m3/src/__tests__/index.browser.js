import tape from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import M3Plugin from '../browser';
import {M3Token} from '../index';

tape('browser m3 counter', t => {
  const UniversalEvents = {
    emit(type, {key, value, tags}) {
      t.equal(type, 'm3:counter', 'calls with correct event type');
      t.equal(key, 'key', 'counter passes key through');
      t.equal(value, 'value', 'counter passes value through');
      t.equal(tags, 'tags', 'counter passes tags through');
      t.end();
    },
  };
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.counter('key', 'value', 'tags');
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('browser m3 timing', t => {
  const UniversalEvents = {
    emit(type, {key, value, tags}) {
      t.equal(type, 'm3:timing', 'calls with correct event type');
      t.equal(key, 'key', 'timing passes key through');
      t.equal(value, 'value', 'timing passes value through');
      t.equal(tags, 'tags', 'timing passes tags through');
      t.end();
    },
  };
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.timing('key', 'value', 'tags');
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('browser m3 gauge', t => {
  const UniversalEvents = {
    emit(type, {key, value, tags}) {
      t.equal(type, 'm3:gauge', 'calls with correct event type');
      t.equal(key, 'key', 'gauge passes key through');
      t.equal(value, 'value', 'gauge passes value through');
      t.equal(tags, 'tags', 'gauge passes tags through');
      t.end();
    },
  };

  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.gauge('key', 'value', 'tags');
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('browser m3 increment', t => {
  const UniversalEvents = {
    emit(type, {key, tags}) {
      t.equal(type, 'm3:increment', 'calls with correct event type');
      t.equal(key, 'key', 'increment passes key through');
      t.equal(tags, 'tags', 'increment passes tags through');
      t.end();
    },
  };
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.increment('key', 'tags');
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('browser m3 decrement', t => {
  const UniversalEvents = {
    emit(type, {key, tags}) {
      t.equal(type, 'm3:decrement', 'calls with correct event type');
      t.equal(key, 'key', 'decrement passes key through');
      t.equal(tags, 'tags', 'decrement passes tags through');
      t.end();
    },
  };
  const app = new App('el', el => el);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.middleware({m3: M3Token}, ({m3}) => {
    m3.decrement('key', 'tags');
    return (ctx, next) => next();
  });
  getSimulator(app);
});
