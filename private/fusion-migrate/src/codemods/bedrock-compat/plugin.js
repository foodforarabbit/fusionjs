const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const visitor = visitNamedModule({
    t,
    packageName: '@uber/bedrock',
    refsHandler: (t, state, refPaths, path) => {
      refPaths.forEach(refPath => {
        if (refPath.scope.block.type.match('Function')) {
          const functionNode = refPath.scope.block;
          functionNode.params[0] = t.identifier('server');
          refPath.parentPath.parentPath.parentPath.remove();
          path.remove();
        }
      });
    },
  });

  return {
    name: 'bedrock-compat',
    visitor,
  };
};
