// @flow
/* eslint-env browser */
import {TealiumToken, TealiumConfigToken} from '@uber/fusion-plugin-tealium';
import plugin from './plugin';
import withTealium from './hoc';

export {TealiumToken, TealiumConfigToken};

export default plugin;
export {withTealium};
