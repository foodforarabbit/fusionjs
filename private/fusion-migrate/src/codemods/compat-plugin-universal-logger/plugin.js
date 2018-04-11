const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');
const {addStatementAfter} = require('../../utils/index.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath, path) => {
    addStatementAfter(
      path,
      `import UniversalLoggerCompatPlugin from '@uber/fusion-plugin-universal-logger-compat'`
    );
    addStatementAfter(
      refPath.parentPath.parentPath.parentPath,
      'app.register(UniversalLoggerCompatPlugin);'
    );
  });
  return {
    name: 'compat-plugin-universal-logger',
    visitor: appVisitor,
  };
};
