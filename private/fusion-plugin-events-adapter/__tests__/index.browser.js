// @noflow
import EventEmitter from './custom-event-emitter.js';
import {getSimulator} from 'fusion-test-utils';
import App, {createPlugin} from 'fusion-core';

// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {EventsAdapterToken, EventsAdapterAnalyticsToken} from '../src/tokens';

import BrowserPlugin from '../src/browser';

test('Browser plugin', async () => {
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
        expect(EventsAdapter).toBeTruthy();
        expect(EventsAdapter.from).toThrow();
      },
    })
  );
  await sim.render('/');
  expect(mapped).toEqual(['*']);
});
