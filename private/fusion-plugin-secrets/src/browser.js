// @flow
import {createPlugin} from 'fusion-core';

import type {SecretPluginType} from './types';

declare var __BROWSER__: boolean;

const plugin =
  __BROWSER__ &&
  createPlugin({
    provides: () => ({
      get: () => {
        if (__DEV__) {
          throw new Error('[fusion-plugin-secrets] No browser service.');
        }
      },
    }),
  });

export default ((plugin: any): SecretPluginType);
