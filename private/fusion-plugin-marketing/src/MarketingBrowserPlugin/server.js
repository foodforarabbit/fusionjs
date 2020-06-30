// @flow

import {createPlugin} from 'fusion-core';
import type {FusionPlugin, Context} from 'fusion-core';
import type {BrowserPluginServiceType} from '../types.js';

const plugin =
  __NODE__ &&
  createPlugin({
    provides() {
      return {
        from: (ctx?: Context) => {
          throw new Error(
            '[fusion-plugin-marketing] MarketingBrowserPlugin not available on server'
          );
        },
      };
    },
  });

export default ((plugin: any): FusionPlugin<empty, BrowserPluginServiceType>);
