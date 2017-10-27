/* eslint-env node */
import assert from 'assert';
import {Plugin} from '@uber/graphene-plugin';

import M3 from './emitters/m3';
import Heatpipe from './emitters/heatpipe';

import routeTiming from './handlers/route-timing';
import browserPerformance from './handlers/browser-performance';

export default function EventsAdapterFactory({UniversalEvents, Session, Geolocation, I18n, config: {appName}}) {
  assert.ok(UniversalEvents, '{UniversalEvents} dependency is required');
  const events = UniversalEvents.of();
  assert.ok(
    events,
    '{UniversalEvents.of()} must return an instance of UniversalEvents'
  );

  const m3 = M3({events});
  const heatpipe = Heatpipe({events, Session, Geolocation, I18n, appName});

  routeTiming({events, m3});
  browserPerformance({events, m3, heatpipe});

  return class NoopPlugin extends Plugin {};
}
