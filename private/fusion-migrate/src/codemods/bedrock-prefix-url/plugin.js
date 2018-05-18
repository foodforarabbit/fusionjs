const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const namedModuleVisitor = visitNamedModule({
    t,
    packageName: '@uber/bedrock/prefix-url',
    refsHandler: (t, state, refPaths, importPath) => {
      refPaths.forEach(refPath => {
        if (refPath.parentPath.type === 'CallExpression') {
          refPath.parentPath.replaceWith(refPath.parent.arguments[0]);
        } else {
          refPath.parentPath.parentPath.remove();
        }
      });
      importPath.remove();
    },
  });

  return {
    name: 'bedrock-prefix-url',
    visitor: namedModuleVisitor,
  };
};
