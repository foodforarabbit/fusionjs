const getUpgrades = require('../get-upgrades.js');

test('getUpgrades', () => {
  const upgrades = getUpgrades({destDir: process.cwd()});
  expect(upgrades).toBeInstanceOf(Array);
  expect(upgrades[0]).toBeInstanceOf(Function);
});
