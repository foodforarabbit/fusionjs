// @flow
import type {helmet$CspDirectives} from 'helmet';
import type {Context} from 'fusion-core';

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

export class CSPOverrideConfig {
  overrides: helmet$CspDirectives = {};
  frameGuardAllowFromDomain: String;
}

export type SecureHeadersDepsType = {
  useFrameGuard: typeof SecureHeadersUseFrameguardConfigToken.optional,
  cspConfig: typeof SecureHeadersCSPConfigToken.optional,
};

export type SecureHeadersServiceType = {
  from: (ctx: Context) => CSPOverrideConfig,
};
