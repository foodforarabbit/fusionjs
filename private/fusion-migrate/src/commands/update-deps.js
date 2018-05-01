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
  '@uber/fusion-plugin-bedrock-compat',
  '@uber/fusion-plugin-universal-logger-compat',
  '@uber/fusion-plugin-universal-m3-compat',
  '@uber/fusion-plugin-web-rpc-compat',
  '@uber/fusion-plugin-proxy-compat',
  '@uber/fusion-plugin-react-router-v3-compat',
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
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());
  const opts = {
    cwd: destDir,
    stdio,
  };

  modulesToRemove.forEach(r => {
    delete destPackage.dependencies[r];
    delete destPackage.devDependencies[r];
  });

  await Promise.all(
    modulesToAdd.map(module => {
      return getVersion(module).then(version => {
        destPackage.dependencies[module] = `^${version}`;
      });
    })
  );

  // Don't upgrade react during migration
  delete srcPackage.dependencies.react;
  delete srcPackage.dependencies['react-dom'];

  Object.assign(destPackage.dependencies, srcPackage.dependencies);
  Object.assign(destPackage.devDependencies, srcPackage.devDependencies);

  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));

  // generate lockfile
  await exec.shell(`yarn --ignore-engines`, opts);
};

async function getVersion(module) {
  const {stdout} = await exec.shell(`yarn info ${module} version --json`);
  return JSON.parse(stdout).data;
}
