const fs = require('fs');
const path = require('path');
const pluginTester = require('babel-plugin-tester');

module.exports = function test(fixtureDir, plugin) {
  const tests = fs.readdirSync(path.join(fixtureDir)).map(fixture => {
    return {
      fixture: path.join(fixtureDir, fixture, 'code.js'),
    };
  });
  pluginTester({
    plugin,
    snapshot: true,
    tests,
  });
};
