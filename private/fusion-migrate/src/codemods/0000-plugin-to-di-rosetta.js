const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-rosetta', '0.2.0'),
  ({source}) => {
    return source.replace(
      `import RosettaPlugin from '@uber/fusion-plugin-rosetta';`,
      `import {I18nConfigToken} from 'fusion-plugin-i18n-react';
import RosettaPlugin from '@uber/fusion-plugin-rosetta';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Rosetta = app.plugin(RosettaPlugin, {service, Logger});`,
      `app.register(I18nConfigToken, RosettaPlugin);`
    );
  }
);
