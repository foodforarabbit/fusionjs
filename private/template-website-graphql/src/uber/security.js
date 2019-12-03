// @flow
import type FusionApp from 'fusion-core';
import HelmetPlugin from 'fusion-plugin-react-helmet-async';
import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';
import AuthHeadersPlugin, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken,
} from '@uber/fusion-plugin-auth-headers';
import SecretsPlugin, {
  SecretsToken,
  DevSecretsToken,
} from '@uber/fusion-plugin-secrets';
import {FetchToken, SessionToken} from 'fusion-tokens';
import Session, {
  SessionSecretToken,
  SessionCookieNameToken,
} from 'fusion-plugin-jwt';

import CsrfProtectionPlugin, {
  CsrfIgnoreRoutesToken,
} from 'fusion-plugin-csrf-protection';

import unfetch from 'unfetch';

// configuration
import authHeadersDevConfig from '../config/auth-headers-dev';
import devSecretsConfig from '../config/dev-sec';
import jwtSessionConfig from '../config/session';
import secureHeadersConfig from '../config/secure-headers';
import csrfConfig from '../config/csrf';

export default function initSecurity(app: FusionApp) {
  // Universal Plugins
  app.register(HelmetPlugin);
  app.enhance(FetchToken, CsrfProtectionPlugin);
  app.register(FetchToken, unfetch);
  if (__NODE__) {
    __DEV__ && app.register(DevSecretsToken, devSecretsConfig);
    app.register(CsrfIgnoreRoutesToken, csrfConfig.ignore);
    app.register(SecureHeadersToken, SecureHeaders);
    app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
    app.register(AuthHeadersToken, AuthHeadersPlugin);
    app.register(SecretsToken, SecretsPlugin);
    app.register(SessionToken, Session);
    app.register(SessionSecretToken, jwtSessionConfig);
    app.register(SessionCookieNameToken, 'jwt-session');
    authHeadersDevConfig.uuid &&
      app.register(AuthHeadersUUIDConfigToken, authHeadersDevConfig.uuid);
    authHeadersDevConfig.groups &&
      app.register(AuthHeadersGroupsConfigToken, authHeadersDevConfig.groups);
    authHeadersDevConfig.roles &&
      app.register(AuthHeadersRolesConfigToken, authHeadersDevConfig.roles);
    authHeadersDevConfig.token &&
      app.register(AuthHeadersTokenConfigToken, authHeadersDevConfig.token);
    authHeadersDevConfig.email &&
      app.register(AuthHeadersEmailConfigToken, authHeadersDevConfig.email);
  }
}
