const fs = require('fs');
const path = require('path');

module.exports = function updateDeps({destDir, svcId}) {
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());

  destPackage.scripts.dev = destPackage.scripts.dev.replace('tmp', svcId);

  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));
};
