const {matchStatement, addStatementAfter} = require('../../utils');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

module.exports = () => ({
  name: 'register-initial-state-plugin',
  visitor: {
    Program(path) {
      ensureImportDeclaration(
        path.node.body,
        'import {GetInitialStateToken} from "fusion-plugin-redux-react"'
      );
      ensureImportDeclaration(
        path.node.body,
        'import GetInitialStatePlugin from "./plugins/get-initial-state"'
      );
    },
    ExpressionStatement(path) {
      const code = `app.register(ReduxToken, ReactReduxPlugin);`;
      const after = `__NODE__ && app.register(GetInitialStateToken, GetInitialStatePlugin)`;
      if (matchStatement(path, code)) {
        addStatementAfter(path, after);
      }
    },
  },
});
