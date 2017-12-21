const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import ReactReduxPlugin from 'fusion-plugin-react-redux';`,
      `import {ReduxToken} from 'fusion-tokens';
import ReactReduxPlugin, {ReduxConfigToken} from 'fusion-plugin-react-redux';`
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
      `app.configure(ReduxConfigToken, {
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
