const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-react-redux', '0.2.0'),
  ({source}) => {
    return source.replace(
      `import ReactReduxPlugin from 'fusion-plugin-react-redux';`,
      `import ReactReduxPlugin, {ReduxToken, ReduxConfigToken} from 'fusion-plugin-react-redux';`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(ReactReduxPlugin, {
  ...reduxOptions,
  enhancer: compose(
    ...[
      reduxActionEnhancerFactory(UniversalEvents),
      reduxOptions.enhancer,
    ].filter(Boolean)
  ),
});`,
      `app.register(ReduxConfigToken, {
    ...reduxOptions,
    enhancer: compose(
      ...[
        reduxActionEnhancerFactory(UniversalEvents),
        reduxOptions.enhancer,
      ].filter(Boolean)
    ),
  });
  app.register(ReduxToken, ReactReduxPlugin);`
    );
  }
);
