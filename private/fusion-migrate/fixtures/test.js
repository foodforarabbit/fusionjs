// ------------------------------------------------
// WARNING: YOU PROBABLY SHOULD NOT TOUCH THIS FILE
// If you need to make a change, consider reaching
// out in the "Web Platform" uchat room describing
// your use case.
// ------------------------------------------------
import App from 'fusion-react';
import SecureHeaders from '@uber/fusion-plugin-secure-headers';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';
import SecretsPlugin, {SecretsToken, SecretsConfigToken} from '@uber/fusion-plugin-secrets';
import {SessionToken} from 'fusion-tokens';
import JWTSessionPlugin, {JWTSessionConfigToken} from 'fusion-plugin-jwt';
import {FetchToken} from 'fusion-tokens';
import CsrfProtectionPlugin, {FetchToken as BaseFetchToken} from 'fusion-plugin-csrf-protection-react';
import UniversalEventsPlugin, {UniversalEventsToken} from 'fusion-plugin-universal-events-react';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import LoggerPlugin, {SentryConfigToken} from '@uber/fusion-plugin-logtron';
import Router from 'fusion-plugin-react-router';
import I18n, {I18nToken, I18nLoaderToken} from 'fusion-plugin-i18n-react';
import TracerPlugin, {TracerToken, TracerConfigToken} from '@uber/fusion-plugin-tracer';
import GalileoPlugin, {GalileoToken} from '@uber/fusion-plugin-galileo';
import TChannelToken from '@uber/fusion-tokens';
import TChannelPlugin from '@uber/fusion-plugin-tchannel';
import Styletron from 'fusion-plugin-styletron-react';
import AtreyuPlugin, {AtreyuToken, AtreyuConfigToken} from '@uber/fusion-plugin-atreyu';
import {I18nConfigToken} from 'fusion-plugin-i18n-react';
import RosettaPlugin from '@uber/fusion-plugin-rosetta';
import BrowserPerformanceEmitterPlugin from 'fusion-plugin-browser-performance-emitter';
import EventsAdapterPlugin from '@uber/fusion-plugin-events-adapter';
import RPC, {RPCToken, RPCConfigToken} from 'fusion-plugin-rpc-redux-react';
      
import ReactReduxPlugin, {
  ReduxToken,
  ReducerToken,
  EnhancerToken,
} from 'fusion-plugin-react-redux';
import reduxActionEnhancerFactory from 'fusion-redux-action-emitter-enhancer';
import ErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';
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
import sentryConfig from './config/sentry.js';
import tracerConfig from './config/tracer.js';

// other
import root from './components/root.js';
import reduxOptions from './redux.js';
import getRPCHandlers from './rpc/handlers.js';

const {team, service} = metaConfig;

export default async function start() {
  const app = new App(root);
  // Universal Plugins
  !__DEV__ && app.register(AssetProxyingPlugin);
  app.register(SecretsToken, SecretsPlugin);
  app.register(SecretsConfigToken, devSecretsConfig);
  app.register(SessionToken, JWTSessionPlugin);
  app.register(JWTSessionConfigToken, jwtSessionConfig);
  app.register(BaseFetchToken, unfetch);
  app
    .register(FetchToken, CsrfProtectionPlugin)
    .alias(FetchToken, BaseFetchToken);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(M3Token, M3Plugin);
  app.register(LoggerToken, LoggerPlugin);
  app.register(SentryConfigToken, sentryConfig);
  app.register(ErrorHandlingPlugin);
  app.register(ReduxToken, ReactReduxPlugin);
  app.register(ReducerToken, reduxOptions.reducer);
  app.register(
    EnhancerToken,
    compose(
      ...[
        reduxActionEnhancerFactory(UniversalEvents),
        reduxOptions.enhancer,
      ].filter(Boolean)
    )
  );
  app.register(SecureHeaders);
  app.register(Router);
  app.register(BrowserPerformanceEmitterPlugin);
  app.register(EventsAdapterPlugin);
  app.register(Styletron);
  app.register(FaviconPlugin);
  app.register(CssResetPlugin);
  app.register(FullHeightPlugin);
  app.register(SuperfineFontsPlugin);
  app.register(HealthPlugin);
  if (__NODE__) {
    // node specific plugins
    app.register(NodePerfEmitterPlugin);
    app.register(I18nConfigToken, RosettaPlugin);
    app.register(TracerToken, TracerPlugin);
    app.register(TracerConfigToken, tracerConfig);
    app.register(GalileoToken, GalileoPlugin);
    app.register(TChannelToken, TChannelPlugin);
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);
    app.register(RPCToken, RPC);
    app.register(RPCConfigToken, getRPCHandlers);
    app.register(I18nToken, I18n);
    app.register(I18nLoaderToken, Rosetta);
  } else {
    // browser specific plugins
    app.register(RPCToken, RPC);
    app.register(I18nToken, I18n);
  }

  return app;
}
