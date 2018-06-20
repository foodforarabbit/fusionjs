const path = require('path');
const pluginTester = require('../../utils/flowconfig-test.js');

const fixtureDir = path.join(
  __dirname,
  '../../__fixtures__/flowconfig-step-fixture/'
);
const plugin = require('../add-flow-libdefs-to-config.js');

pluginTester(fixtureDir, plugin);
