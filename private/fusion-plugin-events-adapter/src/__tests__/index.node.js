// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
// $FlowFixMe
import {I18nToken} from 'fusion-plugin-i18n';
import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
import {EventsAdapterToken} from '../tokens';

import ServerPlugin from '../server';

tape('Server plugin', t => {
  const app = new App('content', el => el);
  class Events extends EventEmitter {
    from() {
      return this;
    }
  }
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(UniversalEventsToken, new Events());
  app.register(M3Token, {});
  app.register(LoggerToken, {});
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

  getSimulator(
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

  t.end();
});
