const plugin = require('./plugin.js');
const decider = require('./decider.js');
const {ProxyConfigToken} = require('./tokens.js');

module.exports = plugin;
module.exports.ProxySSRDecider = decider;
module.exports.ProxyConfigToken = ProxyConfigToken;
