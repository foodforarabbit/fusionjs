// @flow
/* eslint-env browser */

import type {FusionPlugin} from 'fusion-core';
import type {PluginServiceType, DepsType} from './types.js';

const plugin = () => {
  throw new Error(
    'fusion-plugin-graphql-logging-middleware cannot be used in the browser'
  );
};

export default ((plugin: any): (
  schema: any
) => FusionPlugin<DepsType, PluginServiceType>);
