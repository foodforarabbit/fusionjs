// @flow
import ServerLogger from './server';
import {BackendsToken, TransformsToken, TeamToken} from './tokens';
import BrowserLogger from './browser';

export {default as mock} from './mock';

declare var __NODE__: Boolean;
export default __NODE__ ? ServerLogger : BrowserLogger;

export const LogtronBackendsToken = BackendsToken;
export const LogtronTeamToken = TeamToken;
export const LogtronTransformsToken = TransformsToken;

export type * from './types.js';
