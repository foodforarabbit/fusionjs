// @flow
// Main export file
import server from './server.js';
import browser from './browser.js';

export {GalileoToken, GalileoConfigToken} from './tokens.js';

export default __NODE__ ? server : browser;
