const fs = require('fs');
const path = require('path');
const pluginTester = require('babel-plugin-tester');

const tests = fs
  .readdirSync(path.join(__dirname, '../__fixtures__'))
  .map(fixture => {
    return {
      fixture: path.join(__dirname, '../__fixtures__', fixture, 'code.js'),
    };
  });

pluginTester({
  plugin: require('../plugin'),
  snapshot: true,
  tests,
});
