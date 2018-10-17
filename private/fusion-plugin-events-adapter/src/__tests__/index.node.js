// @noflow
import EventEmitter from 'events';
import tape from 'tape-cup';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
// $FlowFixMe
import {I18nToken} from 'fusion-plugin-i18n';
import {M3Token, mock as M3Mock} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
import {EventsAdapterToken} from '../tokens';

import ServerPlugin from '../server';

tape('Server plugin', async t => {
  const app = new App('content', el => el);
  class Events extends EventEmitter {
    from() {
      return this;
    }
  }
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(UniversalEventsToken, new Events());
  app.register(M3Token, M3Mock);
  app.register(LoggerToken, {
    info(msg, meta) {
      t.equal(msg, 'access log');
      t.equal(meta.type, 'request');
      t.equal(meta.route, '/test');
      t.equal(meta.url, '/test');
      t.equal(meta.status, 200);
      t.equal(typeof meta.timing, 'number');
    },
  });
  app.register(HeatpipeToken, {});

  app.register(I18nToken, {
    from() {
      return {
        locale: 'zh-TW',
      };
    },
  });
  app.register(AnalyticsSessionToken, {
    from() {
      return {};
    },
  });

  let M3 = {};
  app.register(
    createPlugin({
      deps: {m3: M3Token},
      provides: ({m3}) => {
        M3 = m3;
      },
    })
  );

  app.middleware((ctx, next) => {
    if (ctx.path === '/test') {
      // $FlowFixMe
      ctx.req.m3Tags = {abcd: 'abcd', route: 'test'};
      ctx.status = 200;
      ctx.body = 'test';
    }
    return next();
  });

  const simulator = getSimulator(
    app,
    createPlugin({
      deps: {
        EventsAdapter: EventsAdapterToken,
      },
      provides({EventsAdapter}) {
        t.ok(EventsAdapter, 'plugin correctly provided');
        t.ok(EventsAdapter.logTiming, 'plugin service provides logTiming()');
      },
    })
  );

  const ctx = await simulator.request('/test');
  await ctx.timing.end;
  const m3Calls = M3.getCalls();

  t.deepEqual(m3Calls[0], [
    'timing',
    [
      'request',
      m3Calls[0][1][1],
      {route: 'test', status: 200, method: 'GET', abcd: 'abcd'},
    ],
  ]);

  t.deepEqual(m3Calls[1], [
    'timing',
    [
      'downstream',
      m3Calls[1][1][1],
      {route: 'test', status: 200, method: 'GET', abcd: 'abcd'},
    ],
  ]);

  t.deepEqual(m3Calls[2], [
    'timing',
    [
      'upstream',
      m3Calls[2][1][1],
      {route: 'test', status: 200, method: 'GET', abcd: 'abcd'},
    ],
  ]);

  t.end();
});

tape('Server plugin with /_static asset request', async t => {
  const app = new App('content', el => el);
  class Events extends EventEmitter {
    from() {
      return this;
    }
  }
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(UniversalEventsToken, new Events());
  app.register(M3Token, M3Mock);
  app.register(LoggerToken, {
    info() {},
  });
  app.register(HeatpipeToken, {});
  app.register(I18nToken, {
    from() {
      return {
        locale: 'zh-TW',
      };
    },
  });
  app.register(AnalyticsSessionToken, {
    from() {
      return {};
    },
  });

  let M3 = {};
  app.register(
    createPlugin({
      deps: {m3: M3Token},
      provides: ({m3}) => {
        M3 = m3;
      },
    })
  );

  app.middleware((ctx, next) => {
    ctx.status = 200;
    ctx.body = 'test';
    return next();
  });

  const simulator = getSimulator(
    app,
    createPlugin({
      deps: {
        EventsAdapter: EventsAdapterToken,
      },
      provides({EventsAdapter}) {
        t.ok(EventsAdapter, 'plugin correctly provided');
        t.ok(EventsAdapter.logTiming, 'plugin service provides logTiming()');
      },
    })
  );

  const ctx = await simulator.request('/_static/abcd.js');
  await ctx.timing.end;
  const m3Calls = M3.getCalls();

  t.deepEqual(m3Calls[0], [
    'timing',
    [
      'request',
      m3Calls[0][1][1],
      {route: 'static_asset', status: 200, method: 'GET'},
    ],
  ]);

  t.deepEqual(m3Calls[1], [
    'timing',
    [
      'downstream',
      m3Calls[1][1][1],
      {route: 'static_asset', status: 200, method: 'GET'},
    ],
  ]);

  t.deepEqual(m3Calls[2], [
    'timing',
    [
      'upstream',
      m3Calls[2][1][1],
      {route: 'static_asset', status: 200, method: 'GET'},
    ],
  ]);

  t.end();
});
