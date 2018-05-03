const {matchExpression, replaceExpression} = require('../../utils');

module.exports = () => ({
  name: 'fix-health-path-check',
  visitor: {
    BinaryExpression(path) {
      if (matchExpression(path, `ctx.url === '/health'`)) {
        replaceExpression(path, `ctx.path === '/health'`);
      }
    },
  },
});
