// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
// $FlowFixMe
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
// $FlowFixMe
import {I18nToken} from 'fusion-plugin-i18n';

import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import HeatpipeEmitter from './emitters/heatpipe-emitter';

import nodePerformance from './handlers/node-performance';
import browserPerformance from './handlers/browser-performance';
import pageViewBrowser from './handlers/page-view-browser';
import reduxAction from './handlers/redux-action';
import routeTiming from './handlers/route-timing';
import rpc from './handlers/rpc';

// $FlowFixMe
export default __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      AnalyticsSession: AnalyticsSessionToken,
      I18n: I18nToken,
      m3: M3Token,
      heatpipe: HeatpipeToken,
      logger: LoggerToken,
    },
    provides: ({events, AnalyticsSession, I18n, m3, heatpipe, logger}) => {
      const serviceName = process.env.SVC_ID || 'dev-service';

      const heatpipeEmitter = HeatpipeEmitter({
        heatpipe,
        AnalyticsSession,
        I18n,
        serviceName,
      });

      nodePerformance({events, m3});
      rpc({events, m3, logger});
      browserPerformance({events, m3, heatpipeEmitter});
      pageViewBrowser({events, heatpipeEmitter});
      reduxAction({events, heatpipeEmitter, m3});
      routeTiming({events, m3});

      return {
        logTiming(key, tags) {
          return value => {
            m3.timing(key, value, tags);
          };
        },
      };
    },
    middleware: (deps, service) => async (
      ctx: Object,
      next: () => Promise<void>
    ) => {
      const {logTiming} = service;

      const createTags = ({route, status}) => {
        const t = {};
        if (route) {
          t.route = ctx.status === 404 ? 'not-found' : ctx.path;
        }
        if (status) {
          t.status = ctx.status;
        }
        return t;
      };

      return next().then(() => {
        ctx.timing.downstream.then(
          logTiming('downstream', createTags({route: true}))
        );
        ctx.timing.upstream.then(
          logTiming('upstream', createTags({route: true, status: true}))
        );
        // only log requests that are not server side renders
        // server side renders are tracked separately as pageviews
        if (!ctx.element) {
          ctx.timing.end.then(
            logTiming('request', createTags({route: true, status: true}))
          );
        }
      });
    },
  });
