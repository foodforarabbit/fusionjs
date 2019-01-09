// @flow

const {parseArgs} = require('./parse-args.js');
const {startCerberus} = require('./cerberus.js');
const {proxy} = require('./proxy.js');
const {Tracker} = require('./analytics.js');

module.exports.run = async function(argv /*: Array<string>*/) {
  const args = parseArgs(argv);

  const tracker = new Tracker();
  tracker.track(args).catch(console.error); // eslint-disable-line no-console

  if (!args.skipCerberus) await startCerberus();
  await proxy(args);
};
