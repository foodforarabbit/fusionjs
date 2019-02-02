// @flow

import server from './server.js';
import browser from './browser.js';

import {
  FeatureTogglesClientToken,
  FeatureTogglesToggleNamesToken,
  FeatureTogglesToken,
} from './tokens.js';

import type {
  FeatureTogglesDepsType,
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
} from './types.js';

export type {
  FeatureTogglesDepsType,
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
};

export {
  FeatureTogglesClientToken,
  FeatureTogglesToggleNamesToken,
  FeatureTogglesToken,
};

export default (__NODE__ ? server : browser);
