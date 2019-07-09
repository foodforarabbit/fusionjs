// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

export {TealiumToken, TealiumConfigToken} from './tokens';
export type {TealiumConfigType, TealiumType, TealiumDepsType} from './types';

declare var __NODE__: Boolean;
export default __NODE__ ? server : browser;
