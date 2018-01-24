// @flow
import tape from 'tape-cup';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
// $FlowFixMe
import {I18nLoaderToken} from 'fusion-plugin-i18n';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
import {EventsAdapterToken, EventsAdapterServiceNameToken} from '../tokens';

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
  app.register(EventsAdapterToken, ServerPlugin);
  app.register(EventsAdapterServiceNameToken, 'awesome-frontend');
  app.register(
    UniversalEventsToken,
    createMockPlugin({
      on() {},
    })
  );
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
