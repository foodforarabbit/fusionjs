const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import AtreyuPlugin from '@uber/fusion-plugin-atreyu';`,
      `import AtreyuPlugin, {AtreyuToken, AtreyuConfigToken} from '@uber/fusion-plugin-atreyu';`
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
  app.configure(AtreyuConfigToken, atreyuConfig);`
    );
  }
);
