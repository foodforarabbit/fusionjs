// @flow

// Main export file
import browser from './browser.js';
import server from './server.js';

export * from './tokens.js';
export * from './types.js';

export default __NODE__ ? server : browser;
