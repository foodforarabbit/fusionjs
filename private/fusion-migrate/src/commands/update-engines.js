const {promisify} = require('util');
const fs = require('fs');

// var execSync = require('child_process').execSync;

const writeFile = promisify(fs.writeFile);
const path = require('path');

module.exports = function updateEngines({destDir}) {
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());
  destPackage.engines = {
    node: fetchRequiredNodeVersion(),
    npm: '4.0.5',
    yarn: fetchRequiredYarnVersion(),
  };
  return writeFile(destPackagePath, JSON.stringify(destPackage, null, 2));
};

function fetchRequiredNodeVersion() {
  // Hard code node version until we support node 10
  return '8.15.0';
  // Borrowed from: https://github.com/tj/n/blob/master/bin/n#L715
  // var latestLTSName = execSync(
  //   'curl https://nodejs.org/dist/ ' +
  //     '| egrep "</a>" ' +
  //     "| egrep -o 'latest-[a-z]{2,}' " +
  //     '| sort ' +
  //     '| tail -n1',
  //   {stdio: 'pipe'}
  // )
  //   .toString()
  //   .trim();

  // var ltsVersion = execSync(
  //   'curl https://nodejs.org/dist/' +
  //     latestLTSName +
  //     '/ ' +
  //     '| egrep "</a>" ' +
  //     "| egrep -o '[0-9]+\\.[0-9]+\\.[0-9]+' " +
  //     '| head -n1',
  //   {stdio: 'pipe'}
  // )
  //   .toString()
  //   .trim();

  // return ltsVersion;
}

function fetchRequiredYarnVersion() {
  // See https://github.com/yarnpkg/yarn/issues/6608
  return '1.9.2';
  // var latestYarnVersion = JSON.parse(
  //   execSync('npm info yarn --json', {stdio: 'pipe'})
  // )['dist-tags'].latest;
  // return latestYarnVersion;
}
