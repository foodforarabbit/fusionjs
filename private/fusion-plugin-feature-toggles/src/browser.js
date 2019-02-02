// @flow
/* eslint-env browser */

import {createPlugin, unescape} from 'fusion-core';

import type {
  IFeatureTogglesClient,
  ToggleDetailsType,
  FeatureTogglesPluginType,
} from './types.js';

const pluginFactory: () => FeatureTogglesPluginType = () =>
  createPlugin({
    provides() {
      class ToggleService implements IFeatureTogglesClient {
        data: {[string]: ToggleDetailsType};

        constructor(data: {[string]: ToggleDetailsType}) {
          this.data = data;

          return this;
        }
        async get(toggleName: string): Promise<?ToggleDetailsType> {
          if (!this.data || !this.data[toggleName]) return null;
          return this.data[toggleName];
        }
      }

      const data = loadToggleData();
      return {
        from: () => {
          return new ToggleService(data);
        },
      };
    },
  });

export default ((__BROWSER__ &&
  pluginFactory(): any): FeatureTogglesPluginType);

/* Helper functions */
const loadToggleData = (): {[string]: ToggleDetailsType} => {
  const element = document.getElementById('__FEATURE_TOGGLES__');
  if (!element) {
    throw new Error(
      '[fusion-plugin-feature-toggles] - Could not find a __FEATURE_TOGGLES__ element'
    );
  }

  try {
    return JSON.parse(unescape(element.textContent)).data;
  } catch (e) {
    throw new Error(
      '[fusion-plugin-feature-toggles] - Error parsing __FEATURE_TOGGLES__ element content'
    );
  }
};
