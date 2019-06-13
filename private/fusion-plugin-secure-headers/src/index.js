// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';
import type {CSPConfigType, SecureHeadersDepsType} from './types';

export {
  SecureHeadersToken,
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersFrameguardAllowFromDomainConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';

declare var __NODE__: Boolean;
export default __NODE__ ? server : browser;
export type {CSPConfigType, SecureHeadersDepsType};
