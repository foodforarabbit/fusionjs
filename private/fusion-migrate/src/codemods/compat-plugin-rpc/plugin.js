const {addStatementAfter} = require('../../utils/index.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath, path) => {
    addStatementAfter(
      path,
      `import RPCCompatEnhancer from '@uber/fusion-plugin-web-rpc-compat'`
    );
    addStatementAfter(
      refPath.parentPath.parentPath.parentPath,
      `app.enhance(EnhancerToken, prevEnhancer => {
        return createPlugin({
          deps: {
            rpcCompat: RPCCompatEnhancerToken,
          },
          provides: ({rpcCompat}) => {
            return compose(prevEnhancer, rpcCompat);
          }
        });
      });`
    );
    addStatementAfter(
      refPath.parentPath.parentPath.parentPath,
      `app.register(RPCCompatEnhancerToken, RPCCompatEnhancer);`
    );
    addStatementAfter(
      refPath.parentPath.parentPath.parentPath,
      `const RPCCompatEnhancerToken = createToken('RPCCompatEnhancer');`
    );
  });
  return {
    name: 'compat-plugin-web-rpc',
    visitor: appVisitor,
  };
};
