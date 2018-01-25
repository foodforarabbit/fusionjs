const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-i18n', '^0.4.0'),
  bump('fusion-plugin-i18n-react', '^0.2.1'),
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
    app.register(I18nLoaderToken, Rosetta);`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(I18n, {fetch});`,
      `app.register(I18nToken, I18n);`
    );
  }
);
