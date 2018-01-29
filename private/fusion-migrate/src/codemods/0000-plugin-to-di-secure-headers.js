const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-secure-headers', '2.0.1'),
  ({source}) =>
    source.replace(
      `import SecureHeaders from '@uber/fusion-plugin-secure-headers';`,
      `import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersServiceNameConfigToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';`
    ),
  ({source}) =>
    source.replace(
      `const {team, service} = metaConfig;`,
      `const {team} = metaConfig;`
    ),
  ({source}) =>
    source.replace(
      `app.plugin(SecureHeaders, {config: secureHeadersConfig});`,
      `app.register(SecureHeadersToken, SecureHeaders);
  app.register(
    SecureHeadersServiceNameConfigToken,
    secureHeadersConfig.service
  );
  app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);`
    )
);
