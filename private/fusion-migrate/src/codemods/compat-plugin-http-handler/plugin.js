const {addStatementAfter, astOf} = require('../../utils/index.js');
const composeVisitors = require('../../utils/compose-visitors.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath) => {
    refPath.parentPath.parentPath.parentPath.parentPath.traverse({
      IfStatement(path) {
        if (path.node.test.name === '__NODE__') {
          path.node.consequent.body.push(
            astOf(`app.register(createServer(), HttpHandlerToken);`)
          );
          path.node.consequent.body.push(
            astOf(`app.register(HttpHandlerPlugin);`)
          );
        }
      },
    });
  });

  const importVisitor = {
    ImportDeclaration(path) {
      const sourceName = path.node.source.value;
      if (sourceName === 'fusion-core') {
        addStatementAfter(
          path,
          `import HttpHandlerPlugin, {HttpHandlerToken} from 'fusion-plugin-http-handler';`
        );
        addStatementAfter(
          path,
          `import createServer from './server/index.js';`
        );
      }
    },
  };

  return {
    name: 'compat-plugin-http-handler',
    visitor: composeVisitors(appVisitor, importVisitor),
  };
};
