// @flow

import type {Token} from 'fusion-core';
import {createToken} from 'fusion-core';

export const AuthHeadersToken: Token<string> = createToken('AuthHeadersToken');

export const AuthHeadersUUIDConfigToken: Token<string> = createToken(
  'AuthHeadersUUIDConfigToken'
);
export const AuthHeadersEmailConfigToken: Token<string> = createToken(
  'AuthHeadersUUIDConfigToken'
);
export const AuthHeadersTokenConfigToken: Token<string> = createToken(
  'AuthHeadersTokenConfigToken'
);
export const AuthHeadersRolesConfigToken: Token<string> = createToken(
  'AuthHeadersRolesConfigToken'
);
export const AuthHeadersGroupsConfigToken: Token<string> = createToken(
  'AuthHeadersGroupsConfig'
);
