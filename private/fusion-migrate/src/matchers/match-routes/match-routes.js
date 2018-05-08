module.exports = state => () => {
  return {
    name: 'match-routes',
    visitor: {
      ExportDefaultDeclaration(path, s) {
        if (state.routesFile) {
          return;
        }
        const declaration = path.node.declaration;
        const filename = s.file.opts.filename;
        if (isRouteElement(declaration)) {
          state.routesFile = filename;
        } else if (
          declaration.type === 'FunctionDeclaration' ||
          declaration.type === 'ArrowFunctionExpression'
        ) {
          const body = declaration.body.body;
          if (!Array.isArray(body)) {
            return;
          }
          const returnStatement = body.find(
            node => node.type === 'ReturnStatement'
          );
          if (returnStatement && isRouteElement(returnStatement.argument)) {
            state.routesFile = filename;
          }
        }
      },
    },
  };
};

function isRouteElement(node) {
  return node.type == 'JSXElement' && node.openingElement.name.name === 'Route';
}
