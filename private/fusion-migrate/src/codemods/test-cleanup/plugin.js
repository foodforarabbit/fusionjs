module.exports = babel => {
  return {
    name: 'test-cleanup',
    visitor: {
      ImportDeclaration(path) {
        // Remove side effect imports from tests
        if (path.get('specifiers').length === 0) {
          path.remove();
        }
      },
      CallExpression(path) {
        // remove require('source-map-support').install()
        if (
          path.node.callee.name === 'require' &&
          path.node.arguments[0].value === 'source-map-support' &&
          path.parentPath.type === 'MemberExpression' &&
          path.parentPath.parentPath.type === 'CallExpression'
        ) {
          path.parentPath.parentPath.remove();
        }
      },
    },
  };
};
