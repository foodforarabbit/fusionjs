const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import M3Plugin from '@uber/fusion-plugin-m3';`,
      `import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';`
    );
  },
  ({source}) => {
    return source.replace(
      `const M3 = app.plugin(M3Plugin, {UniversalEvents, service});`,
      `app.register(M3Token, M3Plugin);`
    );
  }
);
