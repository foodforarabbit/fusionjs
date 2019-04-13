// @flow
/* eslint-env node */
const plugin = require('./plugin.js');
const decider = require('./decider.js');
const {ProxyConfigToken} = require('./tokens.js');

module.exports = plugin;

// $FlowFixMe
module.exports.ProxySSRDecider = decider;

// $FlowFixMe
module.exports.ProxyConfigToken = ProxyConfigToken;
