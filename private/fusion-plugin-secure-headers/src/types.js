// @flow

import {
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersFrameguardAllowFromDomainConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';

export type CSPConfigType = {
  overrides?: Object,
  reportUri?: string | (() => string),
  intentionallyRemoveAllSecurity?: boolean,
  useStrictDynamicMode?: boolean,
  allowInsecureContent?: boolean,
  allowMixedContent?: boolean,
  analyticsServiceNames?: Array<string>,
};

export type SecureHeadersDepsType = {
  useFrameGuard: typeof SecureHeadersUseFrameguardConfigToken.optional,
  frameGuardAllowFromDomain: typeof SecureHeadersFrameguardAllowFromDomainConfigToken.optional,
  cspConfig: typeof SecureHeadersCSPConfigToken.optional,
};
