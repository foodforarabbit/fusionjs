// @flow
import {createToken, type Token} from 'fusion-core';

export const SecureHeadersToken: Token<any> = createToken('SecureHeadersToken');

export const SecureHeadersUseFrameguardConfigToken: Token<boolean> = createToken(
  'SecureHeadersUseFrameguardConfigToken'
);

export const SecureHeadersCSPConfigToken: Token<mixed> = createToken(
  'SecureHeadersCSPConfigToken'
);
