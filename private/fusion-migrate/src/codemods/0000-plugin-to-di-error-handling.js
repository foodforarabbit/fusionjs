const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-error-handling', '0.2.3'),
  ({source}) => {
    return source.replace(
      `app.plugin(ErrorHandlingPlugin, {
    Logger,
    M3,
    CsrfProtection: {
      ignore,
    },
  });`,
      `app.register(ErrorHandlingPlugin);`
    );
  }
);
