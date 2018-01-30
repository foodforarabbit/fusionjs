import {createToken, createOptionalToken} from 'fusion-tokens';

export const SecureHeadersToken = createToken('SecureHeadersToken');

export const SecureHeadersUseFrameguardConfigToken = createOptionalToken(
  'SecureHeadersUseFrameguardConfigToken',
  ''
);
export const SecureHeadersCSPConfigToken = createOptionalToken(
  'SecureHeadersCSPConfigToken',
  ''
);
