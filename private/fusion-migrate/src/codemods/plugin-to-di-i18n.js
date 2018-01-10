const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-i18n', '^0.2.0'),
  ({source}) => {
    return source.replace(
      `import I18n from 'fusion-plugin-i18n-react';`,
      `import I18n, {I18nToken, I18nLoaderToken} from 'fusion-plugin-i18n-react';`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(I18n, {TranslationsLoader: Rosetta});`,
      `app.register(I18nToken, I18n);
  app.configure(I18nLoaderToken, Rosetta);`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(I18n, {fetch});`,
      `app.register(I18nToken, I18n);`
    );
  }
);
