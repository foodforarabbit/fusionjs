const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-react-redux', '0.2.2'),
  remove('fusion-plugin-react-redux'),
  add('fusion-plugin-redux-action-emitter-enhancer', '0.2.2', true),
  ({source}) => {
    return source.replace(
      `import ReactReduxPlugin from 'fusion-plugin-react-redux';
import reduxActionEnhancerFactory from 'fusion-redux-action-emitter-enhancer';`,
      `import ReactReduxPlugin, {
  ReduxToken,
  ReducerToken,
  EnhancerToken,
} from 'fusion-plugin-react-redux';
import ActionEmitterEnhancer from 'fusion-plugin-redux-action-emitter-enhancer';`
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
  })`,
      `app.register(ReduxToken, ReactReduxPlugin);
  app.register(ReducerToken, reduxOptions.reducer);
  app.register(
    EnhancerToken,
    compose(...[ActionEmitterEnhancer, reduxOptions.enhancer].filter(Boolean))
  )`
    );
  }
);
