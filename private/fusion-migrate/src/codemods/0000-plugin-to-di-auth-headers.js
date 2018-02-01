const compose = require('../utils/compose');
const add = require('../utils/add-package');
const write = require('../utils/add-file');

module.exports = compose(
  add('@uber/fusion-plugin-auth-headers', '0.2.2'),
  write(
    'src/config/auth-headers',
    `/* This file should NOT be committed to your repository */
export default {
  uuid: '00000000-0000-0000-0000-000000000000',
};`
  ),
  ({source}) => {
    return source.replace(
      `import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';`,
      `import AuthHeaders, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';`
    );
  },
  ({source}) =>
    source.replace(
      `import secureHeadersConfig from './config/secure-headers';`,
      `import secureHeadersConfig from './config/secure-headers';
import authHeadersDevConfig from './config/auth-headers';`
    ),
  ({source}) => {
    return source.replace(
      `// node specific plugins`,
      `// node specific plugins
    app.register(AuthHeadersToken, AuthHeaders);
    app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);`
    );
  }
);
