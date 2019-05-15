__DEV__ && app.enhance(ReduxToken, redux => {
  return createPlugin({
    provides() {
      return redux;
    },

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
    }
  });
});