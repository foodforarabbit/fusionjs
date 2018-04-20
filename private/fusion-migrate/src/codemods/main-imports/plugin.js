const rewrites = {
  './components/root.js': './shared/components/routes.js',
  './rpc/handlers.js': './server/rpc.js',
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
    },
  };
};
