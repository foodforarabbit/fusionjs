// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
// $FlowFixMe
import {I18nLoaderToken} from 'fusion-plugin-i18n';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
import {EventsAdapterToken} from '../tokens';

import ServerPlugin from '../server';

function createMockPlugin(service) {
  return createPlugin({
    provides() {
      return {
        from() {
          return service;
        },
      };
    },
  });
}

tape('Server plugin', t => {
  const app = new App('content', el => el);
  class Events extends EventEmitter {
    from() {
      return this;
    }
  }
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(UniversalEventsToken, new Events());
  app.register(
    I18nLoaderToken,
    createMockPlugin({
      locale: 'zh-TW',
    })
  );
  app.register(AnalyticsSessionToken, createMockPlugin({}));

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
