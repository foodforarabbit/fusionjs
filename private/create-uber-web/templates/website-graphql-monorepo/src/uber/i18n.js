// @flow
import type FusionApp from 'fusion-core';
import I18n, {I18nToken, I18nLoaderToken} from 'fusion-plugin-i18n-react';
import Rosetta from '@uber/fusion-plugin-rosetta';

export default function initI18n(app: FusionApp) {
  app.register(I18nToken, I18n);
  if (__NODE__) {
    app.register(I18nLoaderToken, Rosetta);
  }
}
