const rewrites = {
  './components/root.js': './shared/components/routes.js',
  './rpc/handlers.js': './server/rpc.js',
  './redux.js': './shared/store.js',
  './redux': './shared/store.js',
};

module.exports = (/*babel*/) => {
  return {
    name: 'main-imports',
    visitor: {
      ImportDeclaration(path) {
        const sourceName = path.node.source.value;
        if (rewrites[sourceName]) {
          path.node.source.value = rewrites[sourceName];
        }
      },
      CallExpression(path) {
        const callee = path.node.callee;
        if (
          callee.type === 'MemberExpression' &&
          callee.property.name === 'accept' &&
          callee.object.type === 'MemberExpression' &&
          callee.object.property.name === 'hot' &&
          rewrites[path.node.arguments[0].value]
        ) {
          path.node.arguments[0].value = rewrites[path.node.arguments[0].value];
        } else if (
          callee.type === 'Identifier' &&
          callee.name === 'require' &&
          path.node.arguments[0].type === 'StringLiteral' &&
          rewrites[path.node.arguments[0].value]
        ) {
          path.node.arguments[0].value = rewrites[path.node.arguments[0].value];
        }
      },
    },
  };
};
