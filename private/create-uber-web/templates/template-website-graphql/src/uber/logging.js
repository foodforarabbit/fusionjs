// @flow
import type FusionApp from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import HeatpipePlugin, {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import LoggerPlugin, {
  LogtronTeamToken,
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron';
import BrowserPerformanceEmitterPlugin from 'fusion-plugin-browser-performance-emitter';
import EventsAdapterPlugin from '@uber/fusion-plugin-events-adapter';
import ErrorHandlingPlugin, {
  ErrorHandlerToken,
} from 'fusion-plugin-error-handling';
import UberErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';
import NodePerfEmitterPlugin from 'fusion-plugin-node-performance-emitter';
import AnalyticsSession, {
  AnalyticsSessionToken,
  AnalyticsCookieTypeToken,
  UberWebEventCookie,
} from '@uber/fusion-plugin-analytics-session';

// configuration
import sentryConfig from '../config/sentry.js';

// other
const team = '{{team}}';

export default function initLogging(app: FusionApp) {
  app.register(ErrorHandlingPlugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(M3Token, M3Plugin);
  app.register(LoggerToken, LoggerPlugin);
  app.register(BrowserPerformanceEmitterPlugin);
  app.register(EventsAdapterPlugin);
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(AnalyticsSessionToken, AnalyticsSession);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);
  if (__NODE__) {
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {sentry: sentryConfig});
    app.register(NodePerfEmitterPlugin);
  }
}
