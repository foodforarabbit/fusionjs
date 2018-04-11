const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');
const {addStatementAfter} = require('../../utils/index.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath, path) => {
    addStatementAfter(
      path,
      `import UniversalM3CompatPlugin from '@uber/fusion-plugin-universal-m3-compat'`
    );
    addStatementAfter(
      refPath.parentPath.parentPath.parentPath,
      'app.register(UniversalM3CompatPlugin);'
    );
  });
  return {
    name: 'compat-plugin-universal-m3',
    visitor: appVisitor,
  };
};
