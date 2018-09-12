// @flow
/* eslint-env browser */

import {createPlugin} from 'fusion-core';
import type {Context, FusionPlugin} from 'fusion-core';
import type {PluginServiceType} from './types.js';

const plugin =
  __BROWSER__ &&
  createPlugin({
    provides() {
      return {
        from: (ctx?: Context) => {
          throw new Error(
            '[fusion-plugin-marketing] No service avaiable in browser.'
          );
        },
      };
    },
  });

export default ((plugin: any): FusionPlugin<empty, PluginServiceType>);
