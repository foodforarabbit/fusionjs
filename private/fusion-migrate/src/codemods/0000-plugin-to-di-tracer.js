const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const remove = require('../utils/remove-file');

module.exports = compose(
  bump('@uber/fusion-plugin-tracer', '0.2.3'),
  remove('src/config/tracer.js'),
  ({source}) => {
    return source.replace(
      `import TracerPlugin from '@uber/fusion-plugin-tracer';`,
      `import TracerPlugin, {TracerToken} from '@uber/fusion-plugin-tracer';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Tracer = app.plugin(TracerPlugin, {Logger, config: tracerConfig});`,
      `app.register(TracerToken, TracerPlugin);`
    );
  },
  ({source}) => {
    return source.replace(
      `import tracerConfig from './config/tracer.js'
;`,
      ``
    );
  }
);
