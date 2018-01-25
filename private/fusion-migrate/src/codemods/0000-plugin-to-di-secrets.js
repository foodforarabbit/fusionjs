const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-secrets', '0.3.0'),
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
