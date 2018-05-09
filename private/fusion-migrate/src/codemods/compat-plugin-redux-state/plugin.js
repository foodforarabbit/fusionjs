const {addStatementAfter} = require('../../utils/index.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
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
      const refPath = refPaths.find(ref => {
        const parent = ref.parent;
        const callee = parent.callee;
        return (
          parent.type === 'CallExpression' &&
          callee.type === 'MemberExpression' &&
          callee.property.name === 'register'
        );
      });
      addStatementAfter(
        refPath.parentPath,
        `app.register(GetInitialStateToken, GetInitialStateCompat)`
      );
    },
  });

  return {
    name: 'compat-plugin-redux-state',
    visitor: reduxTokenVisitor,
  };
};
