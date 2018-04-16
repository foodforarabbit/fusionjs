const path = require('path');
const loadConfig = require('../../../utils/load-config.js');
const pluginTester = require('../../../utils/codemod-test.js');

const fixtureDir = path.join(__dirname, '../__fixtures__');
const getPlugin = require('../plugin');

pluginTester(
  fixtureDir,
  getPlugin({
    keyPath: 'clients.atreyu',
    config: loadConfig(
      path.join(__dirname, '../../../__fixtures__/atreyu-config-fixture')
    ),
  })
);
