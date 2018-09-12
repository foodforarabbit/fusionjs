const assert = require('assert');
const babel = require('@babel/core');
const prettier = require('prettier');

const replaceImport = require('../replace-import.js');
const parserOpts = require('../../parser-opts.js');

const babelOptions = {parserOpts};

const inputs = require('../../__fixtures__/replace-import-fixture/inputs.js');
const expected = require('../../__fixtures__/replace-import-fixture/expected.js');

test('replace import: default specifier, same types', () => {
  const plugin1 = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin1,
    }),
    'defaultSpecifierSameFonts1'
  );

  const plugin2 = replaceImport(`import {a} from 'a';`, `import {c} from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin2,
    }),
    'defaultSpecifierSameFonts2'
  );
});

test('replace import: named specifier, switch types', () => {
  const plugin1 = replaceImport(`import {a} from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin1,
    }),
    'namedSpecifierSwitchTypes1'
  );

  const plugin2 = replaceImport(`import a from 'a';`, `import {c} from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin2,
    }),
    'namedSpecifierSwitchTypes2'
  );
});

test('replace import: doesn`t duplicate new import if it already exists', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'noDuplicates'
  );
});

test('replace import: import not added if no matching source', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'nonMatchingSource'
  );
});

test('replace import: default specifier can have different identifier', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'nonMatchingDefaultSpecifier'
  );
});

test('replace import: named specifier can`t have different identifier', () => {
  const plugin = replaceImport(`import {a} from 'a';`, `import {c} from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'nonMatchingNamedSpecifier'
  );
});

test('replace import: replaces usage if import statement matched', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'replacesUsage'
  );
});

test('replace import: doesn`t replace usage if import statement not matched', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'doesNotReplacesUsage'
  );
});

test('replace import: replaces usage in child scope if not shadowed', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'replacesUsageNoShadow'
  );
});

test('replace import: doesn`t replace usage in child scope if shadowed', () => {
  const plugin = replaceImport(`import a from 'a';`, `import c from 'c';`);
  testWithFixtures(
    () => ({
      visitor: plugin,
    }),
    'doesNotReplaceUsageShadow'
  );
});

function testWithFixtures(plugin, fixtureKey) {
  const {code} = babel.transform(inputs[fixtureKey], {
    plugins: [plugin],
    ...babelOptions,
  });
  assert.equal(
    trimWhitespace(formatter(code)),
    trimWhitespace(expected[fixtureKey])
  );
}

function trimWhitespace(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\t|\n/g, '');
}

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
