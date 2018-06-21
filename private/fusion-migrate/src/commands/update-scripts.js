const fs = require('fs');
const path = require('path');
const getTrackedFiles = require('../utils/get-tracked-files.js');

module.exports = async function updateScripts({srcDir, destDir}) {
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

  destPackage.node = {
    process: 'mock',
    Buffer: true,
  };

  const trackedFiles = await getTrackedFiles(destDir);
  const sassFiles = trackedFiles.filter(f => {
    const ext = path.extname(f);
    return ext === '.scss' || ext === '.sass';
  });
  if (sassFiles.length) {
    destPackage.devDependencies['node-sass'] = '^4.9.0';
    destPackage.scripts['compile-sass'] =
      'node-sass src/client/stylesheets/ -o dist-client/';
    destPackage.scripts['predev'] = 'yarn compile-sass';
    destPackage.scripts['prebuild'] = 'yarn compile-sass';
    destPackage.scripts['prebuild-production'] = 'yarn compile-sass';
  }
  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));
};
