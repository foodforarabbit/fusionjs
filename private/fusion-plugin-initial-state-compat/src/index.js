// @flow
import server from './server.js';
import browser from './browser.js';

export default __NODE__ ? server : browser;
