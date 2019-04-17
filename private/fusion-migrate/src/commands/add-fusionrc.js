const fs = require('fs');
const path = require('path');

module.exports = async function addFusionRC({destDir}) {
  const destPackagePath = path.join(destDir, 'package.json');
  const destPackage = JSON.parse(fs.readFileSync(destPackagePath).toString());
  let babelConfig = {};
  const babelConfigPath = path.join(destDir, 'babel.config.js');
  const babelRCPath = path.join(destDir, '.babelrc');

  // Handle monorepo case
  if (!destPackage.dependencies) {
    fs.writeFileSync(
      `${destDir}/.fusionrc.js`,
      `module.exports = require('../../.fusionrc.js');`
    );
    return;
  }

  if (fs.existsSync(babelRCPath)) {
    babelConfig = JSON.parse(fs.readFileSync(babelRCPath).toString());
  } else if (fs.existsSync(babelConfigPath)) {
    /* eslint-disable-next-line */
    babelConfig = require(babelConfigPath);
  }
  const plugins = Array.isArray(babelConfig.plugins) ? babelConfig.plugins : [];
  const fusionConfig = {
    assumeNoImportSideEffects: true,
    nodeBuiltins: {
      process: 'mock',
      Buffer: true,
    },
    babel: {
      plugins: plugins.filter(p => {
        const pluginName = Array.isArray(p) ? p[0] : p;
        return shouldUsePlugin(pluginName);
      }),
      presets: [],
    },
  };
  const destFusionRCPath = path.join(destDir, '.fusionrc.js');
  fs.writeFileSync(
    destFusionRCPath,
    `module.exports = ${JSON.stringify(fusionConfig, null, 2)};`
  );
  removeBabelDeps(destPackage.dependencies || {});
  removeBabelDeps(destPackage.devDependencies || {});
  fs.writeFileSync(destPackagePath, JSON.stringify(destPackage, null, 2));
};

const removeBlacklist = ['babel-eslint', 'babel-plugin-module-resolver'];
function removeBabelDeps(obj) {
  Object.keys(obj).forEach(key => {
    if (
      key.startsWith('@babel/') ||
      (key.startsWith('babel-') && !removeBlacklist.includes(key))
    ) {
      delete obj[key];
    }
  });
}

// Only whitelisting module-resolver for now
const whitelist = ['module-resolver'];
function shouldUsePlugin(p) {
  return whitelist.some(el => {
    return p.includes(el);
  });
}
