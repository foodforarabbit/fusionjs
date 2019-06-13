// @flow

import ServerLogger from './server';
import BrowserLogger from './browser';

declare var __NODE__: Boolean;
export default __NODE__ ? ServerLogger : BrowserLogger;
export * from './tokens';
