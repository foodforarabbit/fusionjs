const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const getJSFiles = require('./get-js-files.js');
const parserOpts = require('../parser-opts.js');

const transformFile = promisify(babel.transformFile);
const writeFile = promisify(fs.writeFile);

module.exports = async function codemodStep({
  destDir,
  filter,
  plugin,
  plugins,
}) {
  let files = await getJSFiles(destDir);
  if (filter) {
    files = files.filter(filter);
  }
  if (!plugins) {
    plugins = [plugin];
  }
  const results = await Promise.all(
    files.map(f => {
      const joinedPath = path.join(destDir, f);
      return transformFile(joinedPath, {
        plugins,
        babelrc: false,
        parserOpts,
      }).then(({code}) => {
        return {
          file: f,
          joinedPath,
          code,
        };
      });
    })
  );
  await Promise.all(
    results.map(({joinedPath, code}) => {
      return writeFile(joinedPath, code);
    })
  );
  return files;
};
