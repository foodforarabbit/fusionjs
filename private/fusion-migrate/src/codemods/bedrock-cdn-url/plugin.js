const visitNamedModule = require('../../utils/visit-named-module.js');
const path = require('path');
const fs = require('fs');

module.exports = babel => {
  const t = babel.types;
  const namedModuleVisitor = visitNamedModule({
    t,
    packageName: '@uber/bedrock/cdn-url',
    refsHandler: (t, state, refPaths, importPath) => {
      const configDir = findConfigDir(state.file.opts.filename);
      let cdnUrl = loadCdnUrl(configDir);
      if (!cdnUrl.endsWith('/')) {
        cdnUrl = cdnUrl + '/';
      }
      refPaths.forEach(refPath => {
        if (refPath.parentPath.type !== 'CallExpression') {
          refPath.parentPath.parentPath.remove();
          return;
        }
        if (refPath.parent.arguments[0].type === 'StringLiteral') {
          refPath.parentPath.replaceWith(
            t.stringLiteral(cdnUrl + refPath.parent.arguments[0].value)
          );
        } else {
          refPath.parentPath.replaceWith(
            t.binaryExpression(
              '+',
              t.stringLiteral(cdnUrl),
              refPath.parent.arguments[0]
            )
          );
        }
      });
      importPath.remove();
    },
  });

  return {
    name: 'bedrock-cdn-url',
    visitor: {
      ...namedModuleVisitor,
    },
  };
};

function findConfigDir(filePath) {
  let done = false;
  while (!done) {
    filePath = path.dirname(filePath);
    if (fs.existsSync(path.join(filePath, 'config/common.json'))) {
      return path.join(filePath, 'config/');
    } else if (fs.existsSync(path.join(filePath, '.git'))) {
      done = true;
    }
  }
  return null;
}

function loadCdnUrl(configDir) {
  const common = JSON.parse(
    fs.readFileSync(path.join(configDir, 'common.json')).toString()
  );
  if (common.assets && common.assets.cdnBase) {
    return common.assets.cdnBase;
  }
  const prod = JSON.parse(
    fs.readFileSync(path.join(configDir, 'production.json')).toString()
  );
  if (prod.assets && prod.assets.cdnBase) {
    return prod.assets.cdnBase;
  }
  throw new Error('Cannot find cdn url');
}
