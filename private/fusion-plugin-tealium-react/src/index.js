// @flow
/* eslint-env browser */
import {TealiumToken, TealiumConfigToken} from '@uber/fusion-plugin-tealium';

import plugin from './plugin.js';
import withTealium from './hoc.js';

export {TealiumToken, TealiumConfigToken};

export default plugin;
export {withTealium};
