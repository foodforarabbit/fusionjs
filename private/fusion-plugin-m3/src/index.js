// @flow
/* eslint-env browser */
import {createToken} from 'fusion-core';
import server from './server';
import browser from './browser';

declare var __NODE__: Boolean;

export const M3Token = createToken('M3');

export {default as mock} from './mock';

export default (__NODE__ ? server : browser);
export {M3ClientToken, CommonTagsToken} from './server';
