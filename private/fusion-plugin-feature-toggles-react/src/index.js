// @flow

import plugin from './plugin.js';

import Toggle from './toggle.js';
import type {TogglePropsType} from './toggle.js';

export type {
  FeatureTogglesDepsType,
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  FeatureTogglesPluginType,
} from '@uber/fusion-plugin-feature-toggles';

export {
  FeatureTogglesClientToken,
  FeatureTogglesToggleNamesToken,
  FeatureTogglesToken,
} from '@uber/fusion-plugin-feature-toggles';

export {Toggle};
export type {TogglePropsType};

export default plugin;
