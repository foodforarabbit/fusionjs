const fs = require('fs');
const path = require('path');
const exec = require('execa');
const semver = require('semver');

const defaultModulesToRemove = [
  '@uber/urate-widget',
  'livereactload',
  'react-proxy',
  'fusion-plugin-styletron-react',
  '@uber/uber-xhr',
  '@uber/render-page-skeleton',
  '@uber/bedrock',
  '@uber/internal-tool-layout',
  '@uber/isomorphic-i18n',
  '@uber/isorender',
  '@uber/build-tasks',
  '@uber/test-tasks',
  '@uber/eslint-config',
  '@uber/eslint-config-es6',
  '@uber/eslint-config-jsx',
  'react-router',
  'gulp',
  'jsonlint',
  'tape',
  'watchify',
];

const defaultCompatModules = [
  'just-extend',
  'jest-codemods',
  '@uber/fusion-plugin-flipr',
  '@uber/fusion-legacy-styling-compat-mixin',
  '@uber/bedrock-14-compat',
  '@uber/isomorphic-i18n-compat',
  '@uber/fusion-plugin-initial-state-compat',
  '@uber/fusion-plugin-bedrock-compat',
  '@uber/fusion-plugin-universal-logger-compat',
  '@uber/fusion-plugin-universal-m3-compat',
  '@uber/fusion-plugin-web-rpc-compat',
  '@uber/fusion-plugin-proxy-compat',
  '@uber/fusion-plugin-page-skeleton-compat',
  '@uber/fusion-plugin-uber-xhr-compat',
  '@uber/fusion-plugin-react-router-v3-compat',
  '@uber/fusion-plugin-urate',
  'fusion-plugin-http-handler',
];

const defaultUpgradeModules = {
  '@uber/atreyu': '^6.2.0',
  '@uber/web-rpc-redux': '^9.1.2',
  '@uber/web-rpc-atreyu': '^5.0.12',
  'fusion-plugin-react-helmet-async': '1.0.0',
};

module.exports = async function updateDeps({
  srcDir,
  destDir,
  modulesToRemove = defaultModulesToRemove,
  modulesToAdd = defaultCompatModules,
  modulesToUpgrade = defaultUpgradeModules,
  stdio = 'inherit',
}) {
  const srcPackage = JSON.parse(
    fs.readFileSync(path.join(srcDir, 'package.json')).toString()
  );
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());

  if (destPackage.dependencies == null) return; // in monorepo, skip
  if (destPackage.devDependencies == null) return; // in monorepo, skip

  if (
    destPackage.dependencies['react'] &&
    !destPackage.dependencies['react'].startsWith('^16') &&
    !destPackage.dependencies['react'].startsWith('16')
  ) {
    defaultUpgradeModules['fusion-react'] = '1.3.7';
  }

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

  // Install enzyme-adapter-react-15 if necessary
  const reactVersion = destPackage.dependencies.react;
  if (reactVersion) {
    const parsedVersion = semver.coerce(reactVersion);
    if (parsedVersion.major === 15) {
      destPackage.devDependencies['enzyme-adapter-react-15'] = '^1.0.5';
      delete destPackage.devDependencies['enzyme-adapter-react-16'];
    }
  }

  // Don't upgrade react during migration
  delete srcPackage.dependencies.react;
  delete srcPackage.dependencies['react-dom'];
  delete srcPackage.devDependencies['react-test-renderer'];

  Object.assign(destPackage.dependencies, srcPackage.dependencies);
  Object.assign(destPackage.devDependencies, srcPackage.devDependencies);

  Object.keys(modulesToUpgrade).forEach(mod => {
    if (destPackage.dependencies[mod]) {
      destPackage.dependencies[mod] = modulesToUpgrade[mod];
    } else if (destPackage.devDependencies[mod]) {
      destPackage.devDependencies[mod] = modulesToUpgrade[mod];
    }
  });

  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));

  // generate lockfile
  await exec.shell(`yarn --ignore-engines`, opts);
};

async function getVersion(module) {
  const {stdout} = await exec.shell(`yarn info ${module} version --json`);
  return JSON.parse(stdout).data;
}
