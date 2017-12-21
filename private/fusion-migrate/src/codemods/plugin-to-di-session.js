const compose = require('../utils/compose');

module.exports = compose(
  ({source}) => {
    return source.replace(
      `import JWTSessionPlugin from 'fusion-plugin-jwt';`,
      `import {SessionToken} from 'fusion-tokens';
import JWTSessionPlugin, {JWTSessionConfigToken} from 'fusion-plugin-jwt';`
    );
  },
  ({source}) => {
    return source.replace(
      `import getSessionConfig from './config/session.js';`,
      `import jwtSessionConfig from './config/session.js';`
    );
  },
  ({source}) => {
    return source.replace(
      `const Session = app.plugin(JWTSessionPlugin, getSessionConfig({Secrets}));`,
      `app.register(SessionToken, JWTSessionPlugin);
  app.register(JWTSessionConfigToken, jwtSessionConfig);`
    );
  },
  ({source}) => {
    return source.replace(
      `export default ({Secrets}) => {
  return __NODE__ && {secret: Secrets.of().get('server.session.secret')};
};`,
      `import {withDependencies} from 'fusion-core';
import {SecretsToken as Secrets} from '@uber/fusion-plugin-secrets'

export default withDependencies({Secrets}, ({Secrets}) => {
  return __NODE__ && {secrets: Secrets.get('server.session.secret')}
})`
    );
  }
);
