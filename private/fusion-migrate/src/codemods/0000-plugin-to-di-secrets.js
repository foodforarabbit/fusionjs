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
      `app.register(SecretsToken, SecretsPlugin);
  app.register(DevSecretsToken, devSecretsConfig);`
    );
  }
);
