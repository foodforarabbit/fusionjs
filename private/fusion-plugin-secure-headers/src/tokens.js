import {createToken, createOptionalToken} from 'fusion-tokens';

export const SecureHeadersToken = createToken('SecureHeadersToken');

// TODO: Create an internal token repository equivalent to fusion-tokens (for ServiceName)
export const SecureHeadersServiceNameConfigToken = createOptionalToken(
  'SecureHeadersServiceNameConfigToken',
  ''
);
export const SecureHeadersUseFrameguardConfigToken = createOptionalToken(
  'SecureHeadersUseFrameguardConfigToken',
  ''
);
export const SecureHeadersCSPConfigToken = createOptionalToken(
  'SecureHeadersCSPConfigToken',
  ''
);
