// @flow
/* eslint-env browser */

import {createPlugin} from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';

type AuthHeadersService = {from: () => void};
const service: AuthHeadersService = {
  from() {
    throw new Error('Cannot call AuthHeaders.from in the browser');
  },
};

type AuthHeadersPluginType = FusionPlugin<*, AuthHeadersService>;
const plugin: AuthHeadersPluginType = createPlugin({
  provides: () => service,
});

export default plugin;
