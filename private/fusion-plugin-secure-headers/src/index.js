// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';
import type {
  CSPConfigType,
  SecureHeadersDepsType,
  SecureHeadersServiceType,
} from './types';

export {
  SecureHeadersToken,
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens';

export {CSPOverrideConfig} from './types';

declare var __NODE__: Boolean;
export default __NODE__ ? server : browser;
export type {CSPConfigType, SecureHeadersDepsType, SecureHeadersServiceType};
