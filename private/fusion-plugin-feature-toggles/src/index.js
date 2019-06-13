// @flow

import server from './server.js';
import browser from './browser.js';

import {
  FeatureTogglesToken,
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
} from './tokens.js';

import type {
  FeatureTogglesDepsType,
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
  FeatureToggleConfigType,
} from './types.js';

export type {
  FeatureTogglesDepsType,
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
  FeatureToggleConfigType,
};

export {
  FeatureTogglesToken,
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
};

export default __NODE__ ? server : browser;
