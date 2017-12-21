const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import GalileoPlugin from '@uber/fusion-plugin-galileo';`,
      `import {GalileoToken} from '@uber/fusion-uber';
import GalileoPlugin from '@uber/fusion-plugin-galileo';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Galileo = app.plugin(GalileoPlugin, {Logger, Tracer, M3});`,
      `app.register(GalileoToken, GalileoPlugin);`
    );
  }
);
