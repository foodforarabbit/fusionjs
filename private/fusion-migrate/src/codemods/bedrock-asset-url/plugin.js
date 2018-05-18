const visitNamedModule = require('../../utils/visit-named-module.js');
const replaceImportDeclaration = require('../../utils/replace-import-declaration.js');
const path = require('path');
const fs = require('fs');

module.exports = babel => {
  const renameVisitor = replaceImportDeclaration(
    babel.types,
    '@uber/bedrock/asset-url',
    'fusion-core',
    'assetUrl'
  );

  const namedModuleVisitor = visitNamedModule({
    t: babel.types,
    packageName: '@uber/bedrock/asset-url',
    refsHandler: (t, state, refPaths) => {
      refPaths.forEach(refPath => {
        if (refPath.parentPath.type !== 'CallExpression') {
          refPath.parentPath.parentPath.remove();
          return;
        } else if (refPath.parent.arguments[0].type !== 'StringLiteral') {
          return;
        }
        const oldValue = refPath.parent.arguments[0].value;
        const fileName = state.file.opts.filename;
        let newValue = getLocalPathToAsset(oldValue, fileName);
        if (path.isAbsolute(newValue) && newValue.endsWith('.css')) {
          const gitDir = findGitDir(fileName);
          newValue = path.relative(
            path.dirname(fileName),
            path.join(gitDir, 'dist-client', path.basename(newValue))
          );
        }
        refPath.parent.arguments[0].value = newValue;
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
    // fallback to static path
    return staticPath;
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

function findGitDir(filePath) {
  while (filePath !== '/' && filePath !== '.' && filePath !== '') {
    if (fs.existsSync(path.join(filePath, '.git'))) {
      return filePath;
    }
    filePath = path.dirname(filePath);
  }
}
