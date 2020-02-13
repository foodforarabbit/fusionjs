// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

declare var __NODE__: Boolean;
export default __NODE__ ? server : browser;
export {HeatpipeToken, HeatpipeConfigToken} from './tokens';
