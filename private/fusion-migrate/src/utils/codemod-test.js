const babel = require('@babel/core');
const prettier = require('prettier');

const parserOpts = require('../parser-opts.js');
const genericTest = require('./generic-test.js');

module.exports = function test(fixtureDir, plugin) {
  const filename = 'code.js';
  const pluginName = plugin(babel).name;
  const babelOptions = {parserOpts};

  const transform = (fileContents, t) => {
    const {code} = babel.transform(fileContents, {
      plugins: [plugin],
      filename: t.fixture,
      ...babelOptions,
    });
    return code;
  };

  return genericTest(fixtureDir, pluginName, filename, transform, formatter);
};

function formatter(code) {
  return prettier.format(code, {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: false,
    jsxBracketSameLine: false,
    rangeStart: 0,
    rangeEnd: Infinity,
    parser: 'babylon',
  });
}
