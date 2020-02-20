// @flow

import ServerLogger from './server.js';
import BrowserLogger from './browser.js';

import {ErrorTrackingToken, TeamToken} from './tokens.js';

export default __NODE__ ? ServerLogger : BrowserLogger;
export {default as mock} from './mock';

// TODO: temporarily renamed exports for logtron backwards compat
// (they now have nothing to do with logtron)
export const LogtronBackendsToken = ErrorTrackingToken;
export const LogtronTeamToken = TeamToken;
// export const LoggerErrorTrackingToken = ErrorTrackingToken;
// export const LoggerTeamToken = TeamToken;

export type * from './types.js';
