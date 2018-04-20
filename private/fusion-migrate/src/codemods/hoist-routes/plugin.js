module.exports = babel => {
  const t = babel.types;
  return {
    name: 'hoist-routes',
    visitor: {
      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type !== 'FunctionDeclaration') {
          return;
        }
        const routesIdentifier = path.scope.generateUidIdentifier('routes');
        path.traverse({
          ReturnStatement(returnPath) {
            returnPath.replaceWith(
              t.VariableDeclaration('const', [
                t.VariableDeclarator(
                  routesIdentifier,
                  returnPath.node.argument
                ),
              ])
            );
          },
        });
        path.parent.body = path.parent.body.concat(
          path.node.declaration.body.body
        );
        path.parentPath.traverse({
          VariableDeclaration(declarationPath) {
            if (declarationPath.node.declarations[0].id === routesIdentifier) {
              declarationPath.replaceWith(
                t.ExportDefaultDeclaration(
                  declarationPath.node.declarations[0].init
                )
              );
            }
          },
        });
        path.remove();
      },
    },
  };
};
