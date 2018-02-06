// ------------------------------------------------
// WARNING: YOU PROBABLY SHOULD NOT TOUCH THIS FILE
// If you need to make a change, consider reaching
// out in the "Web Platform" uchat room describing
// your use case.
// ------------------------------------------------
import App from 'fusion-react';
import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
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

import CsrfProtection, {
  FetchForCsrfToken,
} from 'fusion-plugin-csrf-protection-react';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events-react';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';

import LoggerPlugin, {
  LogtronTeamToken,
  LogtronBackendsToken,
} from '@uber/fusion-plugin-logtron';
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
import EventsAdapter from '@uber/fusion-plugin-events-adapter';
import AnalyticsSession, {
  UberWebEventCookie,
  AnalyticsCookieTypeToken,
  AnalyticsSessionToken,
} from '@uber/fusion-plugin-analytics-session';
import RPC, {RPCToken, RPCHandlersToken} from 'fusion-plugin-rpc-redux-react';
import ReactReduxPlugin, {
  ReduxToken,
  ReducerToken,
  EnhancerToken,
} from 'fusion-plugin-react-redux';
import ActionEmitterEnhancer from 'fusion-plugin-redux-action-emitter-enhancer';
import ErrorHandling, {ErrorHandlerToken} from 'fusion-plugin-error-handling';
import UberErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';
import NodePerfEmitterPlugin from 'fusion-plugin-node-performance-emitter';
import {compose} from 'redux';
import unfetch from 'unfetch';

// user plugins
import FaviconPlugin from './plugins/favicon.js';
import CssResetPlugin from './plugins/css-reset.js';
import FullHeightPlugin from './plugins/full-height.js';
import SuperfineFontsPlugin from './plugins/superfine-fonts.js';
import HealthPlugin from './plugins/health.js';

// configuration
import metaConfig from './config/meta';
import atreyuConfig from './config/atreyu';
import devSecretsConfig from './config/dev-sec.js';
import jwtSessionConfig from './config/session.js';
import secureHeadersConfig from './config/secure-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import authHeadersDevConfig from './config/auth-headers';
import sentryConfig from './config/sentry.js';

// other
import root from './components/root.js';
import reduxOptions from './redux.js';
import getRPCHandlers from './rpc/handlers.js';

const {team} = metaConfig;

export default async function start() {
  const app = new App(root);
  // Universal Plugins
  !__DEV__ && app.register(AssetProxyingPlugin);
  app.register(SecretsToken, SecretsPlugin);

  app.register(FetchToken, CsrfProtection);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(M3Token, M3Plugin);
  app.register(LoggerToken, LoggerPlugin);

  app.register(ErrorHandling);
  app.register(ReduxToken, ReactReduxPlugin);
  app.register(ReducerToken, reduxOptions.reducer);
  app.register(
    EnhancerToken,
    compose(...[ActionEmitterEnhancer, reduxOptions.enhancer].filter(Boolean))
  );

  app.register(Router);
  app.register(BrowserPerformanceEmitterPlugin);
  app.register(EventsAdapter);
  app.register(AnalyticsSessionToken, AnalyticsSession);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);
  app.register(Styletron);

  if (__NODE__) {
    // node specific plugins
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(SuperfineFontsPlugin);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(LogtronTeamToken, team);
    app.register(LogtronBackendsToken, {backends: {sentry: sentryConfig}});
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    app.register(HealthPlugin);
    app.register(FullHeightPlugin);
    app.register(FaviconPlugin);
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
    app.register(CssResetPlugin);
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    app.register(NodePerfEmitterPlugin);
    app.register(I18nLoaderToken, Rosetta);
    app.register(TracerToken, TracerPlugin);
    app.register(GalileoToken, GalileoPlugin);
    app.register(TChannelToken, TChannel);
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);
    app.register(RPCToken, RPC);
    app.register(RPCHandlersToken, getRPCHandlers);
    app.register(I18nToken, I18n);
  } else {
    // browser specific plugins
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(FetchForCsrfToken, unfetch);
    app.register(RPCToken, RPC);
    app.register(I18nToken, I18n);
  }

  return app;
}
