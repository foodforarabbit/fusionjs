// ------------------------------------------------
// WARNING: YOU PROBABLY SHOULD NOT TOUCH THIS FILE
// If you need to make a change, consider reaching
// out in the "Web Platform" uchat room describing
// your use case.
// ------------------------------------------------
import App from 'fusion-react';
import SecureHeaders from '@uber/fusion-plugin-secure-headers';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';
import SecretsPlugin from '@uber/fusion-plugin-secrets';
import JWTSessionPlugin from 'fusion-plugin-jwt';
import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';
import UniversalEventsPlugin from 'fusion-plugin-universal-events-react';
import M3Plugin from '@uber/fusion-plugin-m3';
import LoggerPlugin from '@uber/fusion-plugin-logtron';
import Router from 'fusion-plugin-react-router';
import I18n from 'fusion-plugin-i18n-react';
import TracerPlugin from '@uber/fusion-plugin-tracer';
import GalileoPlugin from '@uber/fusion-plugin-galileo';
import TChannelPlugin from '@uber/fusion-plugin-tchannel';
import Styletron from 'fusion-plugin-styletron-react';
import AtreyuPlugin from '@uber/fusion-plugin-atreyu';
import RosettaPlugin from '@uber/fusion-plugin-rosetta';
import BrowserPerformanceEmitterPlugin from 'fusion-plugin-browser-performance-emitter';
import EventsAdapterPlugin from '@uber/fusion-plugin-events-adapter';
import RPC from 'fusion-plugin-rpc-redux-react';
import ReactReduxPlugin from 'fusion-plugin-react-redux';
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
import getSessionConfig from './config/session.js';
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
  !__DEV__ && app.plugin(AssetProxyingPlugin);
  const Secrets = app.plugin(SecretsPlugin, devSecretsConfig);
  const Session = app.plugin(JWTSessionPlugin, getSessionConfig({Secrets}));
  const CsrfProtection = app.plugin(CsrfProtectionPlugin, {
    Session,
    fetch: unfetch,
  });
  const {fetch, ignore} = CsrfProtection.of();
  const UniversalEvents = app.plugin(UniversalEventsPlugin, {fetch});
  const M3 = app.plugin(M3Plugin, {UniversalEvents, service});
  const Logger = app.plugin(LoggerPlugin, {
    UniversalEvents,
    M3,
    team,
    service,
    backends: {sentry: sentryConfig},
  });
  app.plugin(ErrorHandlingPlugin, {
    Logger,
    M3,
    CsrfProtection: {
      ignore,
    },
  });
  app.plugin(ReactReduxPlugin, {
    ...reduxOptions,
    enhancer: compose(
      ...[
        reduxActionEnhancerFactory(UniversalEvents),
        reduxOptions.enhancer,
      ].filter(Boolean)
    ),
  });
  app.plugin(SecureHeaders, {config: secureHeadersConfig});
  app.plugin(Router, {UniversalEvents});
  app.plugin(BrowserPerformanceEmitterPlugin, {EventEmitter: UniversalEvents});
  app.plugin(EventsAdapterPlugin, {UniversalEvents, config: {service}});
  app.plugin(Styletron);
  app.plugin(FaviconPlugin);
  app.plugin(CssResetPlugin);
  app.plugin(FullHeightPlugin);
  app.plugin(SuperfineFontsPlugin);
  app.plugin(HealthPlugin);
  if (__NODE__) {
    // node specific plugins
    app.plugin(NodePerfEmitterPlugin, {EventEmitter: UniversalEvents});
    const Rosetta = app.plugin(RosettaPlugin, {service, Logger});
    const Tracer = app.plugin(TracerPlugin, {Logger, config: tracerConfig});
    const Galileo = app.plugin(GalileoPlugin, {Logger, Tracer, M3});
    const TChannel = app.plugin(TChannelPlugin, {service, Logger, M3});
    const Atreyu = app.plugin(AtreyuPlugin, {
      Logger,
      M3,
      Tracer,
      Galileo,
      TChannel,
      config: atreyuConfig,
    });
    app.plugin(RPC, {
      handlers: getRPCHandlers({Atreyu, Logger, M3}),
      EventEmitter: UniversalEvents,
    });
    app.plugin(I18n, {TranslationsLoader: Rosetta});
  } else {
    // browser specific plugins
    app.plugin(RPC, {
      EventEmitter: UniversalEvents,
      fetch,
    });
    app.plugin(I18n, {fetch});
  }

  return app;
}
