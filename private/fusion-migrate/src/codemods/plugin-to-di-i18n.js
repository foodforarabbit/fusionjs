const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import I18n from 'fusion-plugin-i18n-react';`,
      `import I18n from 'fusion-plugin-i18n-react';
  import {I18nToken} from 'fusion-tokens';`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(I18n, {TranslationsLoader: Rosetta});`,
      `app.register(I18nToken, I18n);`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(I18n, {fetch});`,
      `app.register(I18nToken, I18n);`
    );
  }
);
