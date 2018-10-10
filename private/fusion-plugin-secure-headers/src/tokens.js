// @flow
import {createToken} from 'fusion-core';

export const SecureHeadersToken = createToken('SecureHeadersToken');

export const SecureHeadersUseFrameguardConfigToken = createToken(
  'SecureHeadersUseFrameguardConfigToken'
);
export const SecureHeadersCSPConfigToken = createToken(
  'SecureHeadersCSPConfigToken'
);
