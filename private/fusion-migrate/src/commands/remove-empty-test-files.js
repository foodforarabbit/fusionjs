const fs = require('fs');
const {promisify} = require('util');
const getJSFiles = require('../utils/get-js-files.js');

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

module.exports = async function removeEmptyTestFiles({destDir}) {
  const files = await getJSFiles(destDir);
  const testFiles = files.filter(f => f.includes('__tests__'));
  await Promise.all(
    testFiles.map(async f => {
      const contents = (await readFile(f)).toString();
      if (
        !contents.includes('test(') &&
        !contents.includes('describe(') &&
        !contents.includes('it(')
      ) {
        await unlink(f);
      }
    })
  );
};
