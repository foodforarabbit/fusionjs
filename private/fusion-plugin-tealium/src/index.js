// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

export {TealiumToken, TealiumConfigToken} from './tokens';

declare var __NODE__: Boolean;
export default __NODE__ ? server : browser;
