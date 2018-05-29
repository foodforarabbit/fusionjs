const {addStatementAfter} = require('../../utils/index.js');
const {astOf} = require('../../utils');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath, path) => {
    addStatementAfter(
      path,
      `import UberXhrPlugin from '@uber/fusion-plugin-uber-xhr-compat'`
    );
    refPath.parentPath.parentPath.parentPath.parentPath.traverse({
      IfStatement(path) {
        if (path.node.test.name === '__NODE__') {
          path.node.alternate.body.push(astOf('app.register(UberXhrPlugin);'));
        }
      },
    });
  });
  return {
    name: 'compat-plugin-uber-xhr',
    visitor: appVisitor,
  };
};
