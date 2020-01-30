const fs = require('fs');
const path = require('path');
const getTrackedFiles = require('../utils/get-tracked-files.js');

module.exports = async function updateScripts({srcDir, destDir, filter}) {
  if (!filter) {
    filter = () => true;
  }
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());
  const srcPackagePath = path.join(srcDir, 'package.json');
  const srcPackage = JSON.parse(fs.readFileSync(srcPackagePath).toString());

  Object.keys(destPackage.scripts)
    .filter(filter)
    .forEach(script => {
      destPackage.scripts['__old__' + script] = destPackage.scripts[script];
    });
  Object.keys(srcPackage.scripts)
    .filter(filter)
    .forEach(script => {
      destPackage.scripts[script] = srcPackage.scripts[script];
    });

  const trackedFiles = await getTrackedFiles(destDir);
  const sassFiles = trackedFiles.filter(f => {
    const ext = path.extname(f);
    return ext === '.scss' || ext === '.sass';
  });
  if (sassFiles.length && filter('sass')) {
    // package.json files in services in monorepo do not have devDependencies field (it's hoisted to the top package.json)
    if (destPackage.devDependencies) {
      destPackage.devDependencies['node-sass'] = '^4.9.0';
    }
    if (!destPackage.scripts) destPackage.scripts = {};
    destPackage.scripts['compile-sass'] =
      'node-sass src/client/stylesheets/ -o dist-client/';
    destPackage.scripts.predev = 'yarn compile-sass';
    destPackage.scripts.prebuild = 'yarn compile-sass';
    destPackage.scripts['prebuild-production'] = 'yarn compile-sass';
  }
  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));
};
