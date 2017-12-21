const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import RosettaPlugin from '@uber/fusion-plugin-rosetta';`,
      `import {RosettaToken} from 'fusion-tokens';
  import RosettaPlugin from '@uber/fusion-plugin-rosetta';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Rosetta = app.plugin(RosettaPlugin, {service, Logger});`,
      `app.register(RosettaToken, RosettaPlugin);`
    );
  }
);
