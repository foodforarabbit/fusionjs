const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-error-handling', '0.2.3'),
  bump('@uber/fusion-plugin-error-handling', '0.2.2'),
  ({source}) => {
    return source.replace(
      `import ErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';`,
      `import ErrorHandling, {
  ErrorHandlerToken,
} from 'fusion-plugin-error-handling';
import UberErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';`
    );
  },
  ({source}) => {
    return source.replace(
      `app.plugin(ErrorHandlingPlugin, {
    Logger,
    M3,
    CsrfProtection: {
      ignore,
    },
  });`,
      `app.register(ErrorHandling);`
    );
  },
  ({source}) => {
    return source.replace(
      `// node specific plugins`,
      `// node specific plugins
    app.register(ErrorHandlerToken, UberErrorHandlingPlugin);`
    );
  }
);
