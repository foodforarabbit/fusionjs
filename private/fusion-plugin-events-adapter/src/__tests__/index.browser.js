// @flow
import tape from 'tape-cup';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {EventsAdapterToken, EventsAdapterAnalyticsToken} from '../tokens';

import BrowserPlugin from '../browser';

const EventTypesShouldBeMapped = [
  'pageview:browser',
  'redux:action',
  'browser-performance-emitter:stats',
];

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

tape('Browser plugin', t => {
  const mapped = [];

  const app = new App('content', el => el);
  app.register(EventsAdapterToken, BrowserPlugin);
  app.register(EventsAdapterAnalyticsToken, createMockPlugin({}));
  app.register(
    UniversalEventsToken,
    createMockPlugin({
      on() {},
      map(type) {
        mapped.push(type);
      },
    })
  );

  getSimulator(
    app,
    createPlugin({
      deps: {
        EventsAdapter: EventsAdapterToken,
      },
      provides({EventsAdapter}) {
        t.ok(EventsAdapter, 'plugin correctly provided');
        t.throws(EventsAdapter.from, 'plugin provides no service for browser');
      },
    })
  );
  t.deepEqual(mapped, EventTypesShouldBeMapped, 'event types correctly mapped');

  t.end();
});
