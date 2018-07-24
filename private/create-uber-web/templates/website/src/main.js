// @flow
/**
 ╔══════════════════════════════════════════════════════╗
 ║                                                      ║
 ║ WARNING: YOU PROBABLY SHOULD NOT MODIFY THIS FILE    ║
 ║                                                      ║
 ║ Plugins should be added/configured in "src/app.js".  ║
 ║                                                      ║
 ║ If you absolutely must make a change to this file,   ║
 ║ please consider reaching out in the "Web Platform"   ║
 ║ uChat room with your use case so improvements can be ║
 ║ standardized across the company. Thank you!          ║
 ║                                                      ║
 ╚══════════════════════════════════════════════════════╝
*/
import App from 'fusion-react';
import HelmetPlugin from 'fusion-plugin-react-helmet-async';
import {createPlugin} from 'fusion-core';
import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';
import AuthHeadersPlugin, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';
import SecretsPlugin, {
  SecretsToken,
  DevSecretsToken,
} from '@uber/fusion-plugin-secrets';
import {FetchToken, LoggerToken, SessionToken} from 'fusion-tokens';
import Session, {
  SessionSecretToken,
  SessionCookieNameToken,
} from 'fusion-plugin-jwt';
import AnalyticsSession, {
  AnalyticsSessionToken,
  AnalyticsCookieTypeToken,
  UberWebEventCookie,
} from '@uber/fusion-plugin-analytics-session';
import HeatpipePlugin, {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import CsrfProtectionPlugin, {
  FetchForCsrfToken,
  CsrfIgnoreRoutesToken,
} from 'fusion-plugin-csrf-protection-react';

import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events-react';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3-react';

import LoggerPlugin, {
  LogtronTeamToken,
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron-react';
import Router from 'fusion-plugin-react-router';
import I18n, {I18nToken, I18nLoaderToken} from 'fusion-plugin-i18n-react';
import TracerPlugin, {TracerToken} from '@uber/fusion-plugin-tracer';
import GalileoPlugin, {GalileoToken} from '@uber/fusion-plugin-galileo';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import Styletron from 'fusion-plugin-styletron-react';
import AtreyuPlugin, {
  AtreyuToken,
  AtreyuConfigToken,
} from '@uber/fusion-plugin-atreyu';
import Rosetta from '@uber/fusion-plugin-rosetta';
import BrowserPerformanceEmitterPlugin from 'fusion-plugin-browser-performance-emitter';
import EventsAdapterPlugin from '@uber/fusion-plugin-events-adapter';
import RPC, {RPCToken, RPCHandlersToken} from 'fusion-plugin-rpc-redux-react';
import {ReduxToken} from 'fusion-plugin-react-redux';
import ErrorHandlingPlugin, {
  ErrorHandlerToken,
} from 'fusion-plugin-error-handling';
import UberErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';
import NodePerfEmitterPlugin from 'fusion-plugin-node-performance-emitter';
import FontLoaderPlugin, {
  FontLoaderReactConfigToken,
} from 'fusion-plugin-font-loader-react';

import unfetch from 'unfetch';

// configuration
import atreyuConfig from './config/atreyu';
import authHeadersDevConfig from './config/auth-headers-dev.js';
import devSecretsConfig from './config/dev-sec.js';
import jwtSessionConfig from './config/session.js';
import secureHeadersConfig from './config/secure-headers';
import sentryConfig from './config/sentry.js';
import fontConfig from './config/fonts';

// other
import DefaultRoot from './components/root.js';
import RPCHandlersPlugin from './rpc/handlers.js';

import registerPlugins from './app.js';

const team = '{{name}}';

export default async function start(options: any = {}) {
  const root = options.root || DefaultRoot;
  const app = new App(root, options.render);
  app.register(HelmetPlugin);
  // Universal Plugins
  app.register(FetchToken, CsrfProtectionPlugin);
  __NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors']);
  // eslint-disable-next-line no-unused-vars
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(M3Token, M3Plugin);
  app.register(LoggerToken, LoggerPlugin);
  app.register(ErrorHandlingPlugin);

  app.register(FontLoaderPlugin);
  app.register(FontLoaderReactConfigToken, fontConfig);
  app.register(AnalyticsSessionToken, AnalyticsSession);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);
  app.register(Router);
  app.register(BrowserPerformanceEmitterPlugin);
  app.register(EventsAdapterPlugin);
  app.register(Styletron);

  app.register(HeatpipeToken, HeatpipePlugin);

  if (__NODE__) {
    // node specific plugins
    !__DEV__ && app.register(AssetProxyingPlugin);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    app.register(AuthHeadersToken, AuthHeadersPlugin);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {sentry: sentryConfig});
    app.register(SecretsToken, SecretsPlugin);
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    authHeadersDevConfig.uuid &&
      app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    authHeadersDevConfig.groups &&
      app.register(AuthHeadersGroupsConfigToken, authHeadersDevConfig.groups);
    authHeadersDevConfig.roles &&
      app.register(AuthHeadersRolesConfigToken, authHeadersDevConfig.roles);
    authHeadersDevConfig.token &&
      app.register(AuthHeadersTokenConfigToken, authHeadersDevConfig.token);
    authHeadersDevConfig.email &&
      app.register(AuthHeadersEmailConfigToken, authHeadersDevConfig.email);
    app.register(NodePerfEmitterPlugin);
    app.register(I18nLoaderToken, Rosetta);
    app.register(TracerToken, TracerPlugin);
    app.register(GalileoToken, GalileoPlugin);
    app.register(TChannelToken, TChannel);
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);
    app.register(RPCToken, RPC);
    app.register(RPCHandlersToken, RPCHandlersPlugin);
    app.register(I18nToken, I18n);
  } else {
    // browser specific plugins
    app.register(FetchForCsrfToken, unfetch);
    app.register(RPCToken, RPC);
    app.register(I18nToken, I18n);
    // Handle redux hot reloading.
    // This needs to exist in main.js to prevent main.js from reloading.
    __DEV__ &&
      app.enhance(ReduxToken, redux => {
        return createPlugin({
          provides() {
            return redux;
          },
          middleware: () => {
            return (ctx, next) => {
              /* global module */
              if (module.hot) {
                module.hot.accept('./redux', () => {
                  // eslint-disable-next-line cup/no-undef
                  const nextReducer = require('./redux').default.reducer;
                  redux.from(ctx).store.replaceReducer(nextReducer);
                });
              }
              return next();
            };
          },
        });
      });
  }
  registerPlugins(app);
  return app;
}
