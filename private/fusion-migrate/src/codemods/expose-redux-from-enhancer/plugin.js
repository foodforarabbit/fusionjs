const {get, matchExpression} = require('../../utils');

module.exports = ({types: t}) => ({
  name: 'expose-redux-from-enhancer',
  visitor: {
    LogicalExpression(path) {
      const code = `__DEV__ && app.enhance(ReduxToken, redux => {
        return createPlugin({
          middleware: () => {
            return (ctx, next) => {
              /* global module */
              if (module.hot) {
                module.hot.accept('./redux', () => {
                  // eslint-disable-next-line cup/no-undef
                  const nextReducer = require('./redux').default.reducer;
                  redux.from(ctx).store.replaceReducer(nextReducer);
                });
              }
              return next();
            };
          },
        });
      });`;
      if (matchExpression(path, code)) {
        path.traverse({
          ObjectExpression(p) {
            const firstKeyName = get(p, p => p.node.properties[0].key.name);
            if (firstKeyName === 'middleware') {
              const provides = t.objectMethod(
                'method',
                t.identifier('provides'),
                [],
                t.blockStatement([t.returnStatement(t.identifier('redux'))])
              );
              p.node.properties.unshift(provides);
            }
          },
        });
      }
    },
  },
});
