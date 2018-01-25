const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-atreyu', '0.2.0'),
  ({source}) => {
    return source.replace(
      `import AtreyuPlugin from '@uber/fusion-plugin-atreyu';`,
      `import AtreyuPlugin, {
  AtreyuToken,
  AtreyuConfigToken,
} from '@uber/fusion-plugin-atreyu';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Atreyu = app.plugin(AtreyuPlugin, {
      Logger,
      M3,
      Tracer,
      Galileo,
      TChannel,
      config: atreyuConfig,
    });`,
      `app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);`
    );
  }
);
