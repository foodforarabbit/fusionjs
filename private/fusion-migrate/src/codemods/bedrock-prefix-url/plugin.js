const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const namedModuleVisitor = visitNamedModule({
    t,
    packageName: '@uber/bedrock/prefix-url',
    refsHandler: (t, state, refPaths, importPath) => {
      refPaths.forEach(refPath => {
        refPath.parentPath.replaceWith(refPath.parent.arguments[0]);
      });
      importPath.remove();
    },
  });

  return {
    name: 'bedrock-prefix-url',
    visitor: namedModuleVisitor,
  };
};
