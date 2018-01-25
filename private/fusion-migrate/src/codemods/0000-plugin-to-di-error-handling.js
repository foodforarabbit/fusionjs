const compose = require('../utils/compose');

module.exports = compose(
  bump('@uber/fusion-plugin-error-handling', '0.2.0'),
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
