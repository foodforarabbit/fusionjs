// @flow
/* eslint-env browser */

import {createPlugin, type FusionPlugin} from 'fusion-core';
import type {PluginServiceType, DepsType} from './types.js';

const plugin = createPlugin({});

export default ((plugin: any): FusionPlugin<DepsType, PluginServiceType>);
