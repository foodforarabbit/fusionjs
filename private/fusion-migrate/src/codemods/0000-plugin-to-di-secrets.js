const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-secrets', '0.3.2'),
  ({source}) => {
    return source.replace(
      `import SecretsPlugin from '@uber/fusion-plugin-secrets';`,
      `import SecretsPlugin, {
  SecretsToken,
  DevSecretsToken,
} from '@uber/fusion-plugin-secrets';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Secrets = app.plugin(SecretsPlugin, devSecretsConfig);`,
      `app.register(SecretsToken, SecretsPlugin);`
    );
  },
  ({source}) => {
    return source.replace(
      `// node specific plugins`,
      `// node specific plugins
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);`
    );
  },
  ({source}) => {
    return source.replace(
      `export default __NODE__ && {
  devValues: {
    server: {
      session: {
        secret: 'development-session-secret',
      },
    },
  },
};`,
      `export default {
  server: {
    session: {
      secret: 'development-session-secret',
    },
  },
};`
    );
  }
);
