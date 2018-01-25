const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-tracer', '0.2.0'),
  ({source}) => {
    return source.replace(
      `import TracerPlugin from '@uber/fusion-plugin-tracer';`,
      `import TracerPlugin, {
  TracerToken,
  TracerConfigToken,
} from '@uber/fusion-plugin-tracer';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Tracer = app.plugin(TracerPlugin, {Logger, config: tracerConfig});`,
      `app.register(TracerToken, TracerPlugin);
    app.register(TracerConfigToken, tracerConfig);`
    );
  }
);
