// @noflow
import EventEmitter from './custom-event-emitter.js';
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
import {EventsAdapterToken} from '../src/tokens';

import ServerPlugin from '../src/server';
import {M3_ROUTE_METRICS_VERSION as version} from '../src/utils/constants';

test('Server plugin', async () => {
  expect.assertions(11);
  const app = new App('content', el => el);
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(UniversalEventsToken, new EventEmitter());
  app.register(M3Token, M3Mock);
  app.register(LoggerToken, {
    info(msg, meta) {
      expect(msg).toBe('access log');
      expect(meta.type).toBe('request');
      expect(meta.route).toBe('/test');
      expect(meta.url).toBe('/test');
      expect(meta.status).toBe(200);
      expect(typeof meta.timing).toBe('number');
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
      ctx.req.m3Tags = {abcd: 'abcd', route: 'test', version};
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
        expect(EventsAdapter).toBeTruthy();
        expect(EventsAdapter.logTiming).toBeTruthy();
      },
    })
  );

  const ctx = await simulator.request('/test');
  await ctx.timing.end;
  const m3Calls = M3.getCalls();

  expect(m3Calls[0]).toEqual([
    'timing',
    [
      'request',
      m3Calls[0][1][1],
      {route: 'test', status: 200, method: 'GET', abcd: 'abcd', version},
    ],
  ]);

  expect(m3Calls[1]).toEqual([
    'timing',
    [
      'downstream',
      m3Calls[1][1][1],
      {route: 'test', status: 200, method: 'GET', abcd: 'abcd', version},
    ],
  ]);

  expect(m3Calls[2]).toEqual([
    'timing',
    [
      'upstream',
      m3Calls[2][1][1],
      {route: 'test', status: 200, method: 'GET', abcd: 'abcd', version},
    ],
  ]);
});

