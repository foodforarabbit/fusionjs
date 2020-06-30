// @flow
/* eslint-env browser */

import {createPlugin} from 'fusion-core';
import type {FusionPlugin, Context} from 'fusion-core';
import type {PluginServiceType} from '../types.js';

const plugin =
  __BROWSER__ &&
  createPlugin({
    provides() {
      return {
        from: (ctx?: Context) => {
          throw new Error(
            '[fusion-plugin-marketing] No service avaiable in browser, did you mean to use MarketingBrowserPlugin?'
          );
        },
      };
    },
  });

export default ((plugin: any): FusionPlugin<empty, PluginServiceType>);
