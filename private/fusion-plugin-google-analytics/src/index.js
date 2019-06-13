// @flow
/* eslint-env browser */
import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

import server from './server.js';
import browser from './browser.js';

export default __NODE__ ? server : browser;

export {GoogleAnalyticsConfigToken} from './browser.js';
export const GoogleAnalyticsToken: Token<any> = createToken('Google Analytics');
