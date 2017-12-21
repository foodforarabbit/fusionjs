const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import TracerPlugin from '@uber/fusion-plugin-tracer';`,
      `import {TracerToken} from '@uber/fusion-tokens';
import TracerPlugin, {TracerConfigToken} from '@uber/fusion-plugin-tracer';`
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
