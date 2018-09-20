const {matchExpression, replaceExpression} = require('../../utils');

module.exports = () => ({
  name: 'fix-tracer',
  visitor: {
    LogicalExpression(path) {
      if (
        matchExpression(
          path,
          `!__DEV__ && app.register(TracerToken, TracerPlugin)`
        )
      ) {
        replaceExpression(path, `app.register(TracerToken, TracerPlugin)`);
      }
      if (
        matchExpression(
          path,
          `!__DEV__ && app.register(GalileoToken, GalileoPlugin)`
        )
      ) {
        replaceExpression(path, `app.register(GalileoToken, GalileoPlugin)`);
      }
    },
  },
});
