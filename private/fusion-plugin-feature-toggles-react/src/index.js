// @flow

import Toggle from './toggle.js';
import type {TogglePropsType} from './toggle.js';

import FeatureTogglesPlugin from '@uber/fusion-plugin-feature-toggles';

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

export default FeatureTogglesPlugin;
