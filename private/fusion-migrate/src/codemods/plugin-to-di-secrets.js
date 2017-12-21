const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import SecretsPlugin from '@uber/fusion-plugin-secrets';`,
      `import SecretsPlugin, {SecretsToken, SecretsConfigToken} from '@uber/fusion-plugin-secrets';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Secrets = app.plugin(SecretsPlugin, devSecretsConfig);`,
      `app.register(SecretsToken, SecretsPlugin);
  app.register(SecretsConfigToken, devSecretsConfig);`
    );
  }
);
