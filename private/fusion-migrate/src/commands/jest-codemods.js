const path = require('path');
const execa = require('execa');

module.exports = async ({destDir}) => {
  const nodeModulePath = path.join(__dirname, '../../node_modules');
  await execa.shell(
    `${path.join(
      nodeModulePath,
      '.bin/jscodeshift'
    )} --parser=flow -t ${path.join(
      nodeModulePath,
      'jest-codemods/dist/transformers/tape.js'
    )} src/test`,
    {
      cwd: destDir,
      stdio: 'pipe',
    }
  );
};
