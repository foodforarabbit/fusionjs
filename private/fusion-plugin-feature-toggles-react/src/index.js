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
  FeatureToggleConfigType,
} from '@uber/fusion-plugin-feature-toggles';

export {
  FeatureTogglesToken,
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
} from '@uber/fusion-plugin-feature-toggles';

export {Toggle};
export type {TogglePropsType};

export default plugin;
