// @flow

import server from './server.js';
import browser from './browser.js';

import {
  FeatureTogglesToken,
  FeatureTogglesToggleNamesToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
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
  FeatureTogglesToken,
  FeatureTogglesToggleNamesToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
};

export default (__NODE__ ? server : browser);
