const fs = require('fs');
const execa = require('execa');
const path = require('path');

module.exports = async function setupYarn({destDir}) {
  const packageLock = path.join(destDir, 'package-lock.json');
  const shrinkwrap = path.join(destDir, 'npm-shrinkwrap.json');
  if (fs.existsSync(packageLock)) {
    fs.unlinkSync(packageLock);
  }
  if (fs.existsSync(shrinkwrap)) {
    fs.unlinkSync(shrinkwrap);
  }
  // generate lock file
  await execa.shell(`yarn --ignore-engines`);
};
