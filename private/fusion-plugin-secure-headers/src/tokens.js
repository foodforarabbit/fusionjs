// @flow
import {createToken, type Token, type Context} from 'fusion-core';

import type {CSPConfigType} from './types.js';

export const SecureHeadersToken: Token<any> = createToken('SecureHeadersToken');

export const SecureHeadersUseFrameguardConfigToken: Token<boolean> = createToken(
  'SecureHeadersUseFrameguardConfigToken'
);

export const SecureHeadersCSPConfigToken: Token<
  CSPConfigType | (Context => CSPConfigType)
> = createToken('SecureHeadersCSPConfigToken');
