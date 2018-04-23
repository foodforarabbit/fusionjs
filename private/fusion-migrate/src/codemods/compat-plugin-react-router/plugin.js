const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');
const {addStatementAfter} = require('../../utils/index.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath, path) => {
    addStatementAfter(
      path,
      `import RouterV3Compat from 'fusion-plugin-react-router-v3-compat';`
    );
    addStatementAfter(
      refPath.parentPath.parentPath.parentPath,
      'app.register(RouterV3Compat);'
    );
  });
  return {
    name: 'compat-plugin-router-v3-compat',
    visitor: appVisitor,
  };
};
