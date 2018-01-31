const compose = require('../utils/compose');

module.exports = compose(
  add('@uber/fusion-plugin-auth-headers', '0.2.2', true),
  ({source}) =>
    source.replace(
      `import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying'`,
      `import AuthHeadersPlugin, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';`
    ),
  ({source}) =>
    source.replace(
      `import secureHeadersConfig from './config/secure-headers';`,
      `import secureHeadersConfig from './config/secure-headers';
import authHeadersDevConfig from './config/auth-headers';`
    ),
  ({source}) =>
    source.replace(
      `app.register(UniversalEventsToken, UniversalEvents`,
      `app.register(AuthHeadersToken, AuthHeadersPlugin);
app.register(UniversalEventsToken, UniversalEvents`
    )
);
