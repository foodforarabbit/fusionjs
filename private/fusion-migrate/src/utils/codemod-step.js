const {promisify} = require('util');
const babel = require('@babel/core');

const getJSFiles = require('./get-js-files.js');
const parserOpts = require('../parser-opts.js');
const genericStep = require('./generic-step.js');

const transformFile = promisify(babel.transformFile);

module.exports = async function codemodStep({
  destDir,
  filter,
  plugin,
  plugins,
}) {
  const files = await getJSFiles(destDir);
  if (!plugins) {
    plugins = [plugin];
  }

  const transform = async (joinedPath, file) => {
    return transformFile(joinedPath, {
      plugins,
      babelrc: false,
      parserOpts,
    }).then(({code}) => {
      return {
        file: file,
        joinedPath,
        content: code,
      };
    });
  };

  return await genericStep({
    destDir,
    filter,
    files,
    transform,
  });
};
