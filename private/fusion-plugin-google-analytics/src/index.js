/* eslint-env browser */
import {createToken} from 'fusion-tokens';
import server from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);
export {GoogleAnalyticsConfigToken} from './browser';
export const GoogleAnalyticsToken = createToken('Google Analytics');
