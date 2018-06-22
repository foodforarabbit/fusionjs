const {
  addStatementAfter,
  replaceStatement,
  addImportSpecifier,
  matchStatement,
  matchExpression,
} = require('../../utils/index.js');
const composeVisitors = require('../../utils/compose-visitors.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath) => {
    refPath.parentPath.parentPath.parentPath.parentPath.traverse({
      IfStatement(path) {
        path.traverse({
          BinaryExpression(path) {
            const toMatch = `typeof authHeadersDevConfig.uuid === 'string'`;

            if (matchExpression(path, toMatch)) {
              replaceStatement(
                path.parentPath,
                'authHeadersDevConfig.uuid && app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);'
              );

              addStatementAfter(
                path.parentPath,
                'authHeadersDevConfig.email && app.register(AuthHeadersEmailConfigToken, authHeadersDevConfig.email);'
              );

              addStatementAfter(
                path.parentPath,
                'authHeadersDevConfig.token && app.register(AuthHeadersTokenConfigToken, authHeadersDevConfig.token);'
              );

              addStatementAfter(
                path.parentPath,
                'authHeadersDevConfig.roles && app.register(AuthHeadersRolesConfigToken, authHeadersDevConfig.roles);'
              );

              addStatementAfter(
                path.parentPath,
                'authHeadersDevConfig.groups && app.register(AuthHeadersGroupsConfigToken, authHeadersDevConfig.groups);'
              );
            }
          },
        });
      },
      VariableDeclaration(path) {
        remove(
          path,
          `const authHeadersDevConfig = {uuid: process.env.UBER_OWNER_UUID};`
        );
      },
    });
  });

  const importCode = `import authHeadersDevConfig from './config/auth-headers-dev.js';`;
  let shouldAddConfigImport = true;
  const importVisitor = {
    Program(path) {
      path.traverse({
        ImportDeclaration(path) {
          if (matchStatement(path, importCode)) {
            shouldAddConfigImport = false;
          }
        },
      });
    },
    ImportDeclaration(path) {
      // Add import for config/auth-headers-dev.js
      const sourceName = path.node.source.value;
      if (shouldAddConfigImport && sourceName.includes('./config/')) {
        addStatementAfter(
          path,
          `import authHeadersDevConfig from './config/auth-headers-dev.js';`
        );
        shouldAddConfigImport = false;
      }

      // Add imports for remaining config tokens (e.g. AuthHeadersEmailConfigToken)
      const code = `import AuthHeadersPlugin, { AuthHeadersToken, AuthHeadersUUIDConfigToken, } from '@uber/fusion-plugin-auth-headers';`;
      if (matchStatement(path, code)) {
        addImportSpecifier(path, 'AuthHeadersEmailConfigToken');
        addImportSpecifier(path, 'AuthHeadersTokenConfigToken');
        addImportSpecifier(path, 'AuthHeadersRolesConfigToken');
        addImportSpecifier(path, 'AuthHeadersGroupsConfigToken');
      }
    },
  };

  return {
    name: 'move-auth-headers-config-from-main',
    visitor: composeVisitors(appVisitor, importVisitor),
  };
};

function remove(path, code) {
  if (path && path.node && matchStatement(path, code, {shallow: true})) {
    path.remove();
  }
}
