const visitNamedModule = require('../../utils/visit-named-module.js');
const replaceImportDeclaration = require('../../utils/replace-import-declaration.js');
const path = require('path');
const fs = require('fs');

module.exports = babel => {
  const renameVisitor = replaceImportDeclaration(
    babel.types,
    '@uber/bedrock/assetUrl',
    'fusion-core',
    'assetUrl'
  );

  const namedModuleVisitor = visitNamedModule({
    t: babel.types,
    packageName: '@uber/bedrock/assetUrl',
    refsHandler: (t, state, refPaths) => {
      refPaths.forEach(refPath => {
        if (refPath.parent.arguments[0].type !== 'StringLiteral') {
          // TODO: Add comment or throw error or something
          return;
        }
        refPath.parent.arguments[0].value = getLocalPathToAsset(
          refPath.parent.arguments[0].value,
          state.file.opts.filename
        );
      });
    },
  });

  return {
    name: 'bedrock-asset-url',
    visitor: {
      ImportDeclaration(path, state) {
        namedModuleVisitor.ImportDeclaration(path, state);
        renameVisitor.ImportDeclaration(path, state);
      },
    },
  };
};

function getLocalPathToAsset(staticPath, fileName) {
  const staticDir = findAssetDir(fileName, staticPath);
  if (!staticDir) {
    throw new Error('Could not find static dir');
  }
  return path.relative(
    path.dirname(fileName),
    path.join(staticDir, staticPath)
  );
}

function findAssetDir(filePath, asset) {
  let done = false;
  while (!done) {
    filePath = path.dirname(filePath);
    if (fs.existsSync(path.join(filePath, asset))) {
      return filePath;
    } else if (fs.existsSync(path.join(filePath, 'client/', asset))) {
      return path.join(filePath, 'client');
    } else if (fs.existsSync(path.join(filePath, 'src/client', asset))) {
      return path.join(filePath, 'src/client');
    } else if (fs.existsSync(path.join(filePath, '.git'))) {
      done = true;
    }
  }
  return null;
}
