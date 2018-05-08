const {promisify} = require('util');
const fs = require('fs');
const babel = require('@babel/core');

const parserOpts = require('../parser-opts.js');

const readFile = promisify(fs.readFile);

module.exports = async function test(fixture, plugin) {
  const state = {};
  const fileContents = (await readFile(fixture)).toString();
  babel.transform(fileContents, {
    plugins: [plugin(state)],
    filename: fixture,
    parserOpts,
  });
  return state;
};
