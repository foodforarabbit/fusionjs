/* eslint-env browser */
import {createToken} from 'fusion-tokens';
import server from './server';
import browser from './browser';

export const M3Token = createToken('M3');

export {default as mock} from './mock';

export default (__NODE__ ? server : browser);
export {M3ClientToken, CommonTagsToken} from './server';
