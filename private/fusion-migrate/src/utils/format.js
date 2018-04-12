const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const getJsFiles = require('./get-js-files.js');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

module.exports = async function format(destDir) {
  const files = await getJsFiles(destDir);
  await Promise.all(files.map(f => formatFile(path.join(destDir, f))));
};

async function formatFile(filePath) {
  const source = await readFile(filePath);
  const prettySource = prettier.format(source.toString(), {
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
  await writeFile(filePath, prettySource);
}
module.exports.formatFile = formatFile;
