// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
import {I18nToken} from 'fusion-plugin-i18n';
import {AuthHeadersToken} from '@uber/fusion-plugin-auth-headers';

import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import type {FusionPlugin} from 'fusion-core';

import HeatpipeEmitter from './emitters/heatpipe-emitter';

import nodePerformance from './handlers/node-performance';
import browserPerformance from './handlers/browser-performance';
import customEvent from './handlers/custom-event';
import pageViewBrowser from './handlers/page-view-browser';
import reduxAction from './handlers/redux-action';
import routeTiming from './handlers/route-timing';
import rpc from './handlers/rpc';
import AccessLog from './utils/access-log.js';
import accessLogHandler from './handlers/access-log';
import sanitizeRouteForM3 from './utils/sanitize-route-for-m3.js';

import type {EventsAdapterDepsType, EventsAdapterType} from './types.js';

const plugin =
  __NODE__ &&
  createPlugin<EventsAdapterDepsType, EventsAdapterType>({
    deps: {
      events: UniversalEventsToken,
      AnalyticsSession: AnalyticsSessionToken,
      AuthHeaders: AuthHeadersToken.optional,
      I18n: I18nToken.optional,
      m3: M3Token,
      heatpipe: HeatpipeToken,
      logger: LoggerToken,
    },
    provides: ({
      events,
      AnalyticsSession,
      AuthHeaders,
      I18n,
      m3,
      heatpipe,
      logger,
    }) => {
      const serviceName = process.env.SVC_ID || 'dev-service';
      const runtime = process.env.UBER_RUNTIME_ENVIRONMENT || 'development';

      const heatpipeEmitter = HeatpipeEmitter({
        logger,
        heatpipe,
        // $FlowFixMe
        AnalyticsSession,
        AuthHeaders,
        I18n,
        serviceName,
        runtime,
      });

      nodePerformance({events, m3});
      rpc({events, m3, logger});
      browserPerformance({events, m3, heatpipeEmitter});
      pageViewBrowser({events, heatpipeEmitter});
      reduxAction({events, heatpipeEmitter, m3});
      routeTiming({events, m3, logger});
      customEvent({events, heatpipeEmitter, m3});
      accessLogHandler({events, logger});

      return {
        logTiming(key, tags) {
          return value => {
            m3.timing(key, value, tags);
          };
        },
      };
    },
    middleware: ({logger, events}, service) => async (
      ctx: Object,
      next: () => Promise<void>
    ) => {
      const {logTiming} = service;
      const accessLog = AccessLog(events.from(ctx));
      ctx.timing.end.then(timing => {
        const tags = {
          route:
            ctx.status === 404 ? 'not-found' : sanitizeRouteForM3(ctx.path),
          status: ctx.status,
          method: ctx.method,
          ...ctx.req.m3Tags, // Bedrock compatability
        };

        // only log requests that are not server side renders
        // server side renders are tracked separately as pageviews
        if (!ctx.element) {
          logTiming('request', tags)(timing);
          accessLog({
            type: 'request',
            url: ctx.url,
            route: ctx.path,
            status: ctx.status,
            timing,
          });
        }

        ctx.timing.downstream.then(logTiming('downstream', tags));
        ctx.timing.upstream.then(logTiming('upstream', tags));
      });

      return next();
    },
  });

export default ((plugin: any): FusionPlugin<*, *>);
