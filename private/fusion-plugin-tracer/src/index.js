// @flow

// Main export file
import browser from './browser.js';
import server from './server.js';
import {
  TracerOptionsToken as OptionsToken,
  TracerConfigToken as ConfigToken,
} from './tokens.js';

export {TracerToken} from './tokens.js';

export default (__NODE__ ? server : browser);

export const TracerOptionsToken = __NODE__ && OptionsToken;
export const TracerConfigToken = __NODE__ && ConfigToken;
