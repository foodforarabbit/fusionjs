// @flow
import type FusionApp from 'fusion-core';
import Router from 'fusion-plugin-react-router';
import Styletron, {AtomicPrefixToken} from 'fusion-plugin-styletron-react';
import FontLoaderPlugin, {
  FontLoaderReactToken,
  FontLoaderReactConfigToken,
} from 'fusion-plugin-font-loader-react';

// configuration
import fontConfig from '../config/fonts';

export default function initUI(app: FusionApp) {
  app.register(FontLoaderReactToken, FontLoaderPlugin);
  app.register(FontLoaderReactConfigToken, fontConfig);
  app.register(Router);
  app.register(Styletron);
  app.register(AtomicPrefixToken, "_");
}
