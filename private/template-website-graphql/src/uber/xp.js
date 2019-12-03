// @flow
import type FusionApp from 'fusion-core';
import FeatureTogglesPlugin, {
  FeatureTogglesTogglesConfigToken,
} from '@uber/fusion-plugin-feature-toggles-react';

// configuration
import featureTogglesConfig from '../config/toggles.js';

export default function initUI(app: FusionApp) {
  app.register(FeatureTogglesPlugin);
  if (__NODE__) {
    app.register(FeatureTogglesTogglesConfigToken, featureTogglesConfig);
  }
}
