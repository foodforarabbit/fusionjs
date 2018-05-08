const {relative, dirname} = require('path');

const rewrites = {
  './components/root.js': state => state.routesFile,
  './rpc/handlers.js': './server/rpc.js',
  './redux.js': './shared/store.js',
  './redux': './shared/store.js',
};

module.exports = state => (/*babel*/) => {
  return {
    name: 'main-imports',
    visitor: {
      ImportDeclaration(path, s) {
        const sourceName = path.node.source.value;
        if (rewrites[sourceName]) {
          let rewrite = rewrites[sourceName];
          if (typeof rewrite === 'function') {
            rewrite = relative(dirname(s.file.opts.filename), rewrite(state));
            if (!rewrite.startsWith('.')) {
              rewrite = './' + rewrite;
            }
          }
          path.node.source.value = rewrite;
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
