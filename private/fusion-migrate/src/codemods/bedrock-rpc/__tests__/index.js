const path = require('path');
const pluginTester = require('../../../utils/codemod-test.js');

const fixtureDir = path.join(__dirname, '../__fixtures__');
const plugin = require('../plugin');

pluginTester(fixtureDir, plugin);
