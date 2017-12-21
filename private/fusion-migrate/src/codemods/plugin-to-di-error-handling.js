const compose = require('../utils/compose');

module.exports = ({source}) => {
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
};
