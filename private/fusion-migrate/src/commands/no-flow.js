const fs = require('fs');
const path = require('path');
const getJsFiles = require('../utils/get-js-files.js');

module.exports = async function addNoFlow({destDir}) {
  const jsFiles = await getJsFiles(destDir);
  jsFiles.forEach(f => {
    const filePath = path.join(destDir, f);
    const contents = fs.readFileSync(filePath).toString();
    if (contents.includes('@flow') || contents.includes('@noflow')) {
      return;
    }
    fs.writeFileSync(filePath, '// @noflow\n' + contents);
  });
};
