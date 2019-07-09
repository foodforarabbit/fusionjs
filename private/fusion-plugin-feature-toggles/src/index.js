// @flow

import server from './server.js';
import browser from './browser.js';

export type {
  FeatureTogglesDepsType,
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
  FeatureToggleConfigType,
} from './types.js';

export type {MorpheusContextType} from './clients/morpheus.js';

export {
  FeatureTogglesToken,
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
} from './tokens.js';

export default __NODE__ ? server : browser;
