// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
// $FlowFixMe
import {I18nLoaderToken} from 'fusion-plugin-i18n';

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
  events: UniversalEvents,
  AnalyticsSession: AnalyticsSessionPlugin,
  I18n: I18nPlugin,
  serviceName: string,
};

// $FlowFixMe
export default __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      AnalyticsSession: AnalyticsSessionToken,
      I18n: I18nLoaderToken,
    },
    provides: ({events, AnalyticsSession, I18n}) => {
      const serviceName = process.env.SVC_ID || 'dev-service';

      const m3 = M3(events);
      const log = Logger(events);
      const heatpipe = Heatpipe({
        events,
        AnalyticsSession,
        I18n,
        serviceName,
      });

      nodePerformance(events, m3);
      rpc(events, m3, log);
      browserPerformance({events, m3, heatpipe});
      pageViewBrowser({events, heatpipe});
      reduxAction(events, heatpipe, m3);
      routeTiming({events, m3});

      return {
        logTiming(m3, key, tags) {
          return value => {
            m3.timing({key, value, tags});
          };
        },
      };
    },
    middleware: ({events}: EventsAdapterDeps, service) => async (
      ctx: Object,
      next: () => Promise<void>
    ) => {
      const {logTiming} = service;

      const reqEvents = events.from(ctx);
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
    },
  });
