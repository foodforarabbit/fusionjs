// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

declare var __NODE__: Boolean;

export {default as mock} from './mock';

export default (__NODE__ ? server : browser);
export {M3Token, M3ClientToken, CommonTagsToken} from './tokens.js';
