// @flow
import Server from './server.js';
import Browser from './browser.js';

import {InitializeServerToken, BedrockCompatToken} from './tokens';

export default __NODE__ ? Server : Browser;
export {InitializeServerToken, BedrockCompatToken};
