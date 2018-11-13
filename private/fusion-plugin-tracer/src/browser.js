// @flow
import {createPlugin} from 'fusion-core';
import type {TracerPluginType} from './types.js';

const pluginFactory = () =>
  createPlugin({
    provides: () => {},
  });

export default ((__BROWSER__ && pluginFactory(): any): TracerPluginType);
