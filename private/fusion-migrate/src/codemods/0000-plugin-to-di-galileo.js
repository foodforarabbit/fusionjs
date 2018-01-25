const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-galileo', '0.2.1'),
  ({source}) => {
    return source.replace(
      `import GalileoPlugin from '@uber/fusion-plugin-galileo';`,
      `import GalileoPlugin, {GalileoToken} from '@uber/fusion-plugin-galileo';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Galileo = app.plugin(GalileoPlugin, {Logger, Tracer, M3});`,
      `app.register(GalileoToken, GalileoPlugin);`
    );
  }
);
