// @flow
/* eslint-env node */
import assert from 'assert';

import M3 from './emitters/m3';
import Logger from './emitters/logger';
import Heatpipe from './emitters/heatpipe';

import nodePerformance from './handlers/node-performance';
import browserPerformance from './handlers/browser-performance';
import pageViewBrowser from './handlers/page-view-browser';
import reduxAction from './handlers/redux-action';
import routeTiming from './handlers/route-timing';
import rpc from './handlers/rpc';

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
  const log = Logger(events);
  const heatpipe = Heatpipe({
    events,
    AnalyticsSession,
    Geolocation,
    I18n,
    service,
  });

  nodePerformance(events, m3);
  rpc(events, m3, log);
  browserPerformance({events, m3, heatpipe});
  pageViewBrowser({events, heatpipe});
  reduxAction(events, heatpipe, m3);
  routeTiming({events, m3});

  function logTiming(m3, key, tags) {
    return value => {
      m3.timing({key, value, tags});
    };
  }

  return async function middleware(ctx: Object, next: () => Promise<void>) {
    const reqEvents = UniversalEvents.of(ctx);
    const reqM3 = M3(reqEvents);
    return next().then(() => {
      const tags = ctx.status < 300 ? {route: ctx.path} : {};
      ctx.timing.downstream.then(logTiming(reqM3, 'downstream', tags));
      ctx.timing.upstream.then(logTiming(reqM3, 'upstream', tags));
      // only log requests that are not server side renders
      // server side renders are tracked separately as pageviews
      if (!ctx.element) {
        ctx.timing.end.then(logTiming(reqM3, 'request', tags));
      }
    });
  };
}
