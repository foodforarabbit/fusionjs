const compose = require('../utils/compose');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('fusion-plugin-jwt', '0.3.4'),
  ({source}) => {
    return source.replace(
      `import JWTSessionPlugin from 'fusion-plugin-jwt';`,
      `import {SessionToken} from 'fusion-tokens';
import Session, {
  SessionSecretToken,
  SessionCookieNameToken,
} from 'fusion-plugin-jwt';`
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
      `app.register(SessionToken, Session);
  app.register(SessionSecretToken, jwtSessionConfig);
  app.register(SessionCookieNameToken, 'jwt-session');`
    );
  },
  ({source}) => {
    return source.replace(
      `export default ({Secrets}) => {
  return __NODE__ && {secret: Secrets.of().get('server.session.secret')};
};`,
      `import {createPlugin} from 'fusion-core';
import {SecretsToken} from '@uber/fusion-plugin-secrets';

export default createPlugin({
  deps: {Secrets: SecretsToken},
  provides({Secrets}) {
    return __NODE__ && Secrets.get('server.session.secret');
  },
});`
    );
  }
);
