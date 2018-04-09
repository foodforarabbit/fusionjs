const fs = require('fs');
const {promisify} = require('util');

const writeFile = promisify(fs.writeFile);
const path = require('path');

module.exports = function updateEngines({destDir, srcDir}) {
  const destPackagePath = path.join(destDir, 'package.json');
  const srcPackagePath = path.join(srcDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());
  const srcPackage = JSON.parse(fs.readFileSync(srcPackagePath).toString());
  destPackage.engines = srcPackage.engines;
  return writeFile(destPackagePath, JSON.stringify(destPackage, null, 2));
};
