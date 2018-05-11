const {addStatementAfter} = require('../../utils/index.js');
const {astOf} = require('../../utils');
const composeVisitors = require('../../utils/compose-visitors.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');
const visitNamedModule = require('../../utils/visit-named-module.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;

  const appVisitor = visitNewAppExpression(t, (t, state, refPath) => {
    refPath.parentPath.parentPath.parentPath.parentPath.traverse({
      IfStatement(path) {
        if (path.node.test.name === '__NODE__') {
          path.node.consequent.body.push(
            astOf(`app.register(GetInitialStateToken, GetInitialStateCompat)`)
          );
        }
      },
    });
  });
  const reduxTokenVisitor = visitNamedModule({
    t,
    moduleName: 'ReduxToken',
    packageName: 'fusion-plugin-react-redux',
    refsHandler: (t, state, refPaths, path) => {
      const body = getProgram(path).node.body;
      ensureImportDeclaration(
        body,
        `import {GetInitialStateToken} from 'fusion-plugin-react-redux'`
      );
      addStatementAfter(
        path,
        `import GetInitialStateCompat from '@uber/fusion-plugin-initial-state-compat'`
      );
    },
  });

  return {
    name: 'compat-plugin-redux-state',
    visitor: composeVisitors(reduxTokenVisitor, appVisitor),
  };
};
