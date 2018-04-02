const path = require('path');
const pluginTester = require('../../../utils/codemod-test.js');

const fixtureDir = path.join(__dirname, '../__fixtures__');
const getPlugin = require('../plugin');

pluginTester(
  fixtureDir,
  getPlugin({
    dir: path.join(__dirname, '../../../__fixtures__/atreyu-config-fixture'),
    keyPath: 'clients.atreyu',
  })
);
