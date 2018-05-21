const {
  executeTransformations,
} = require('jest-codemods/dist/cli/transformers.js');

module.exports = async () => {
  await executeTransformations(
    ['src/test'],
    {force: true, dry: false, verbose: true, parser: 'babel'},
    ['tape']
  );
};
