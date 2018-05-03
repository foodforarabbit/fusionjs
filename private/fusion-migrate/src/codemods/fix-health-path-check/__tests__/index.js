const path = require('path');
const pluginTester = require('babel-plugin-tester');

pluginTester({
  plugin: require('../plugin'),
  fixtures: path.join(__dirname, '../__fixtures__'),
});
