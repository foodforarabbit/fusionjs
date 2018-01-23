/* eslint-env browser */
import server from './server';
import browser from './browser';

export {
  SecureHeadersToken,
  SecureHeadersServiceNameConfigToken,
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from './tokens.js';

export default (__NODE__ ? server : browser);
