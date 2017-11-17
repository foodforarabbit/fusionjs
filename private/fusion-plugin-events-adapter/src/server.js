// @flow
/* eslint-env node */
import assert from 'assert';
import {Plugin} from 'fusion-core';

import M3 from './emitters/m3';
import Heatpipe from './emitters/heatpipe';

import browserPerformance from './handlers/browser-performance';
import pageViewBrowser from './handlers/page-view-browser';
import reduxAction from './handlers/redux-action';
import routeTiming from './handlers/route-timing';

type EventsAdapterDeps = {
  UniversalEvents: UniversalEvents,
  AnalyticsSession: AnalyticsSessionPlugin,
  Geolocation: GeolocationPlugin,
  I18n: I18nPlugin,
  config: {
    service: string,
  },
};
export default function EventsAdapterFactory({
  UniversalEvents,
  AnalyticsSession,
  Geolocation,
  I18n,
  config: {service},
}: EventsAdapterDeps) {
  assert.ok(UniversalEvents, '{UniversalEvents} dependency is required');
  const events = UniversalEvents.of();
  assert.ok(
    events,
    '{UniversalEvents.of()} must return an instance of UniversalEvents'
  );

  const m3 = M3(events);
  const heatpipe = Heatpipe({
    events,
    AnalyticsSession,
    Geolocation,
    I18n,
    service,
  });

  browserPerformance({events, m3, heatpipe});
  pageViewBrowser({events, heatpipe});
  reduxAction(events, heatpipe, m3);
  routeTiming({events, m3});

  return new Plugin({
    Service: () => {
      throw new Error('No available service for EventsAdapter');
    },
  });
}
