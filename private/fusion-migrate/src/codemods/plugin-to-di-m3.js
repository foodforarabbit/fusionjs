const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import M3Plugin from '@uber/fusion-plugin-m3';`,
      `import {M3Token, ServiceConfigToken} from '@uber/fusion-tokens';
  import M3Plugin from '@uber/fusion-plugin-m3';`
    );
  },
  ({source}) => {
    return source.replace(
      `const M3 = app.plugin(M3Plugin, {UniversalEvents, service});`,
      `app.configure(ServiceConfigToken, service);
  app.register(M3Token, M3Plugin);`
    );
  }
);
