const replaceImportDeclaration = require('../../utils/replace-import-declaration.js');

module.exports = babel => {
  const renameVisitor = replaceImportDeclaration(
    babel.types,
    '@uber/bedrock/universal-logger',
    '@uber/fusion-plugin-universal-logger-compat'
  );

  return {
    name: 'bedrock-universal-logger',
    visitor: renameVisitor,
  };
};
