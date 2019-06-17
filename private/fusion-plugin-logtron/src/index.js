// @flow

import ServerLogger from './server.js';
import BrowserLogger from './browser.js';

import {BackendsToken, TransformsToken, TeamToken} from './tokens.js';

export {default as mock} from './mock';

export default __NODE__ ? ServerLogger : BrowserLogger;

export const LogtronBackendsToken = BackendsToken;
export const LogtronTeamToken = TeamToken;
export const LogtronTransformsToken = TransformsToken;

export type * from './types.js';
