const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const namedModuleVisitor = visitNamedModule({
    t: babel.types,
    packageName: './config/secure-headers',
    refsHandler: (t, state, refPaths) => {
      refPaths.forEach(refPath => {
        if (
          refPath.parentPath.type === 'MemberExpression' &&
          refPath.parent.property.name === 'csp'
        ) {
          refPath.parentPath.replaceWith(refPath);
        }
      });
    },
  });

  return {
    name: 'csp-export',
    visitor: namedModuleVisitor,
  };
};
