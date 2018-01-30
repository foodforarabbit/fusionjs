const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-tracer', '0.2.2'),
  ({source}) => {
    return source.replace(
      `import AuthHeadersPlugin from '@uber/fusion-plugin-auth-headers';`,
      `import AuthHeadersPlugin, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';`
    );
  },
  ({source}) => {
    return source.replace(
      `// eslint-disable-next-line no-unused-vars
  const AuthHeaders = app.plugin(AuthHeadersPlugin, autoHeadersDevConfig);`,
      `app.register(AuthHeadersToken, AuthHeadersPlugin);
  app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);`
    );
  }
);
