const visitNamedModule = require('./visit-named-module.js');

module.exports = function visitNewAppExpression(t, handler) {
  return visitNamedModule({
    t,
    packageName: 'fusion-react',
    refsHandler: (t, state, refPaths, path) => {
      const newExpressionPaths = refPaths.filter(refPath => {
        return refPath.parent.type === 'NewExpression';
      });
      if (newExpressionPaths.length === 0) {
        throw new Error(`Could not find 'new App' expression`);
      } else if (newExpressionPaths.length > 1) {
        throw new Error(
          `Found ${newExpressionPaths.length} 'new App' expressions. Expected 1`
        );
      }
      return handler(t, state, newExpressionPaths.pop(), path);
    },
  });
};
