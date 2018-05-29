const replaceImportDeclaration = require('../../utils/replace-import-declaration.js');

module.exports = babel => {
  const renameVisitor = replaceImportDeclaration(
    babel.types,
    '@uber/uber-xhr',
    '@uber/fusion-plugin-uber-xhr-compat',
    'UberXhr'
  );

  return {
    name: 'rename-uber-xhr',
    visitor: renameVisitor,
  };
};
