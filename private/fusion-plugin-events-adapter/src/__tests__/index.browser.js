// @flow
import tape from 'tape-cup';
import EventEmitter from 'events';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {EventsAdapterToken, EventsAdapterAnalyticsToken} from '../tokens';

import BrowserPlugin from '../browser';

tape('Browser plugin', async t => {
  const mapped = [];

  class Events extends EventEmitter {
    from() {
      return this;
    }
    map(type) {
      mapped.push(type);
    }
  }
  const app = new App('content', el => el);
  app.register(EventsAdapterToken, BrowserPlugin);
  app.register(EventsAdapterAnalyticsToken, {
    from() {
      return {};
    },
  });
  app.register(UniversalEventsToken, new Events());

  const sim = getSimulator(
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
  await sim.render('/');
  t.deepEqual(mapped, ['*'], 'All event types to be mapped');

  t.end();
});
