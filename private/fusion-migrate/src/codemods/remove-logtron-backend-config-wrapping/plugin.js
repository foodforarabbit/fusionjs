const {matchStatement} = require('../../utils');

module.exports = () => ({
  name: 'remove-logtron-backend-config-wrapping',
  visitor: {
    ExpressionStatement(path) {
      const code = `app.register(LogtronBackendsToken, { backends: {} });`;
      if (matchStatement(path, code, {shallow: true})) {
        path.traverse({
          CallExpression(path) {
            // `{ backends: {a: 1, b: 2} }` => `{a: 1, b: 2}`
            path.node.arguments[1] = path.node.arguments[1].properties[0].value;
          },
        });
      }
    },
  },
});
