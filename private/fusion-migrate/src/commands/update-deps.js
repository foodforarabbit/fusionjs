const fs = require('fs');
const path = require('path');
const exec = require('execa');

const defaultModulesToRemove = [
  '@uber/bedrock',
  '@uber/internal-tool-layout',
  '@uber/isomorphic-i18n',
  '@uber/isorender',
  '@uber/build-tasks',
  '@uber/test-tasks',
  '@uber/eslint-config',
  '@uber/eslint-config-es6',
  '@uber/eslint-config-jsx',
  'gulp',
  'jsonlint',
  'tape',
  'watchify',
];

const defaultCompatModules = [
  '@uber/bedrock-14-compat',
  '@uber/fusion-plugin-universal-logger-compat',
  '@uber/fusion-plugin-universal-m3-compat',
  '@uber/fusion-plugin-web-rpc-compat',
  'fusion-plugin-http-handler',
];

module.exports = async function updateDeps({
  srcDir,
  destDir,
  modulesToRemove = defaultModulesToRemove,
  modulesToAdd = defaultCompatModules,
  stdio = 'inherit',
}) {
  const srcPackage = JSON.parse(
    fs.readFileSync(path.join(srcDir, 'package.json')).toString()
  );
  const destPackage = JSON.parse(
    fs.readFileSync(path.join(destDir, 'package.json')).toString()
  );
  const opts = {
    cwd: destDir,
    stdio,
  };
  if (!fs.existsSync(path.join(destDir, 'yarn.lock'))) {
    // generate lockfile
    await exec.shell('yarn --ignore-engines', opts);
  }

  const destPackageDeps = Object.keys(destPackage.dependencies).concat(
    Object.keys(destPackage.devDependencies)
  );
  const filteredModulesToRemove = modulesToRemove.filter(m =>
    destPackageDeps.includes(m)
  );
  // remove old modules
  await exec.shell(
    `yarn remove ${filteredModulesToRemove.join(' ')} --ignore-engines`,
    opts
  );
  // add new modules
  await exec.shell(
    `yarn add ${Object.keys(srcPackage.dependencies)
      .concat(modulesToAdd)
      .join(' ')} --ignore-engines`,
    opts
  );
  await exec.shell(
    `yarn add ${Object.keys(srcPackage.devDependencies).join(
      ' '
    )} -D --ignore-engines`,
    opts
  );
};
