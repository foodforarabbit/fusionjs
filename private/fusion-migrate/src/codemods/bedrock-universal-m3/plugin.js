const replaceImportDeclaration = require('../../utils/replace-import-declaration.js');

module.exports = babel => {
  const renameVisitor = replaceImportDeclaration(
    babel.types,
    '@uber/bedrock/universal-m3',
    '@uber/fusion-plugin-universal-m3-compat',
    'M3'
  );

  return {
    name: 'bedrock-universal-m3',
    visitor: renameVisitor,
  };
};
