// @flow
import {createPlugin} from 'fusion-core';

import type {GalileoPluginType} from './types.js';

export default ((__BROWSER__ && createPlugin({}): any): GalileoPluginType);
