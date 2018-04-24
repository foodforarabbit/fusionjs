/* globals describe, it */
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const prettier = require('prettier');

const readFile = promisify(fs.readFile);
const parserOpts = require('../parser-opts.js');

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
    babelOptions: {parserOpts},
  });
};

const separator = '\n\n      ↓ ↓ ↓ ↓ ↓ ↓\n\n';

function pluginTester({plugin, tests, babelOptions}) {
  const name = plugin(babel).name;
  describe(name, () => {
    tests.forEach(t => {
      const fixtureName = path.basename(path.dirname(t.fixture));
      it(fixtureName, async () => {
        const fileContents = (await readFile(t.fixture)).toString();
        const {code} = babel.transform(fileContents, {
          plugins: [plugin],
          filename: t.fixture,
          ...babelOptions,
        });
        expect(format(fileContents) + separator + format(code)).toMatchSnapshot(
          fixtureName
        );
      });
    });
  });
}

function format(code) {
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
