// @flow

import {
  SecureHeadersUseFrameguardConfigToken,
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
  cspConfig: typeof SecureHeadersCSPConfigToken.optional,
};
