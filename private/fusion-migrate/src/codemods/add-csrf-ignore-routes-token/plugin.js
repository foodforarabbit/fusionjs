const {
  matchStatement,
  addImportSpecifier,
  addStatementAfter,
} = require('../../utils');

module.exports = () => ({
  name: 'add-csrf-ignore-routes-token',
  visitor: {
    Program(path) {
      let hasCsrfProtection = false;
      let hasErrorHandling = false;
      path.traverse({
        Identifier({node}) {
          if (node.name === 'CsrfIgnoreRoutesToken') path.skip();
        },
        StringLiteral({node}) {
          if (node.value === 'fusion-plugin-csrf-protection-react') {
            hasCsrfProtection = true;
          } else if (node.value === 'fusion-plugin-error-handling') {
            hasErrorHandling = true;
          }
        },
      });
      if (!hasCsrfProtection || !hasErrorHandling) path.skip();
    },
    ImportDeclaration(path) {
      const code = `import CsrfProtectionPlugin, {FetchForCsrfToken} from 'fusion-plugin-csrf-protection-react';`;
      if (matchStatement(path, code)) {
        addImportSpecifier(path, 'CsrfIgnoreRoutesToken');
      }
    },
    ExpressionStatement(path) {
      const code = `app.register(FetchToken, CsrfProtectionPlugin);`;
      const after = `__NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors'])`;
      if (matchStatement(path, code)) {
        addStatementAfter(path, after);
      }
    },
  },
});
