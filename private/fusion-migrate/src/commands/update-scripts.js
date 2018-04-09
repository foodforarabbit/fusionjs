const fs = require('fs');
const path = require('path');

module.exports = function updateEngines({srcDir, destDir}) {
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());
  const srcPackagePath = path.join(srcDir, 'package.json');
  const srcPackage = JSON.parse(fs.readFileSync(srcPackagePath).toString());

  Object.keys(destPackage.scripts).forEach(script => {
    destPackage.scripts['__old__' + script] = destPackage.scripts[script];
  });
  Object.keys(srcPackage.scripts).forEach(script => {
    destPackage.scripts[script] = srcPackage.scripts[script];
  });
  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));
};
