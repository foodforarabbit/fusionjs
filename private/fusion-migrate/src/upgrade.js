const scaffold = require('./utils/scaffold.js');
const getUpgrades = require('./get-upgrades.js');
const log = require('./log.js');

async function upgrade(name, sub, options = {}) {
  const upgrades = getUpgrades({
    srcDir: await scaffold(),
    destDir: options.dir || process.cwd(),
  });
  await runUpgrades(upgrades);
}
async function runUpgrades(upgrades) {
  for (const upgrade of upgrades) {
    await upgrade().catch(log);
  }
}

module.exports = upgrade;
module.exports.upgrade = runUpgrades;
