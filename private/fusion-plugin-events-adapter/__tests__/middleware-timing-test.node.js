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
import {EventsAdapterToken, EventsAdapterMiddlewareTimingAllowListToken} from '../src/tokens';

import ServerPlugin from '../src/server';
import {M3_ROUTE_METRICS_VERSION as version} from '../src/utils/constants';

test('Server plugin works with middleware timing', async () => {
  const mockHeatpipe = {
    asyncPublish: jest.fn().mockResolvedValue(true),
  };

  const app = new App('content', el => el);
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(UniversalEventsToken, new EventEmitter());
  app.register(M3Token, M3Mock);
  app.register(LoggerToken, {
    info(msg, meta) {
    },
  });
  app.register(HeatpipeToken, mockHeatpipe);
  app.register(EventsAdapterMiddlewareTimingAllowListToken, ['/_events']);

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
    if (ctx.path === '/_events') {
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
      },
    })
  );

  const ctx = await simulator.request('/_events');
  await ctx.timing.end;
  expect(mockHeatpipe.asyncPublish).toHaveBeenCalled();
});

