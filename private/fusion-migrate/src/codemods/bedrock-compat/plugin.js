const replaceImportDeclaration = require('../../utils/replace-import-declaration.js');

module.exports = version => babel => {
  const renameVisitor = replaceImportDeclaration(
    babel.types,
    '@uber/bedrock',
    `@uber/bedrock-${version}-compat`
  );

  return {
    name: `bedrock-${version}-compat`,
    visitor: renameVisitor,
  };
};
