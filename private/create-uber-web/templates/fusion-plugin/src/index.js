// @flow
import server from './server.js';
import browser from './browser.js';
import {Token} from './constants.js';

export {Token};
export default (__NODE__ ? server : browser);
