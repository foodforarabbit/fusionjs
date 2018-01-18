// @flow

import {createToken, createOptionalToken} from 'fusion-tokens';

export const AuthHeadersToken: string = createToken('AuthHeadersToken');

export const AuthHeadersUUIDConfigToken: string = createOptionalToken(
  'AuthHeadersUUIDConfigToken',
  ''
);
export const AuthHeadersEmailConfigToken: string = createOptionalToken(
  'AuthHeadersUUIDConfigToken',
  ''
);
export const AuthHeadersTokenConfigToken: string = createOptionalToken(
  'AuthHeadersTokenConfigToken',
  ''
);
export const AuthHeadersRolesConfigToken: string = createOptionalToken(
  'AuthHeadersRolesConfigToken',
  ''
);
export const AuthHeadersGroupsConfigToken: string = createOptionalToken(
  'AuthHeadersGroupsConfig',
  ''
);
