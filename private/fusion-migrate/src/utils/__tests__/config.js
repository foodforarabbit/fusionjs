const generate = require('babel-generator').default;
const path = require('path');
const loadConfig = require('../load-config.js');
const getConfigDeclaration = require('../get-config-declaration.js');

const fixtureDir = path.join(__dirname, '../../__fixtures__/config-fixture/');
test('loadConfig', () => {
  const {common, dev, prod} = loadConfig(fixtureDir);
  expect(common).toMatchSnapshot();
  expect(dev).toMatchSnapshot();
  expect(prod).toMatchSnapshot();
});

test('getConfigDeclaration', () => {
  const config = loadConfig(fixtureDir);
  const declaration = getConfigDeclaration(config, 'b');
  const source = generate(declaration);
  expect(source).toMatchSnapshot();
});

test('getConfigDeclaration undefined production values', () => {
  const config = loadConfig(fixtureDir);
  const declaration = getConfigDeclaration(config, 'noProduction');
  const source = generate(declaration);
  expect(source).toMatchSnapshot();
});

test('getConfigDeclaration undefined dev values', () => {
  const config = loadConfig(fixtureDir);
  const declaration = getConfigDeclaration(config, 'noDev');
  const source = generate(declaration);
  expect(source).toMatchSnapshot();
});

test('getConfigDeclaration undefined common values', () => {
  const config = loadConfig(fixtureDir);
  const declaration = getConfigDeclaration(config, 'noCommon');
  const source = generate(declaration);
  expect(source).toMatchSnapshot();
});
