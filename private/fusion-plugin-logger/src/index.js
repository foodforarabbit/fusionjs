// @flow

import ServerLogger from './server.js';
import BrowserLogger from './browser.js';

import {ErrorTrackingToken, TeamToken} from './tokens.js';

export default __NODE__ ? ServerLogger : BrowserLogger;

export const LoggerErrorTrackingToken = ErrorTrackingToken;
export const LoggerTeamToken = TeamToken;

export type * from './types.js';
