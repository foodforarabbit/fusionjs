/* eslint-env browser */
import {createToken} from 'fusion-core';
import server from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);
export {GoogleAnalyticsConfigToken} from './browser';
export const GoogleAnalyticsToken = createToken('Google Analytics');
