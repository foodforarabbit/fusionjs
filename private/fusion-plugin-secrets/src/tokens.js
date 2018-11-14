// @flow
import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {SecretServiceType} from './types';

export const SecretsToken: Token<SecretServiceType> = createToken('Secrets');
export const DevSecretsToken: Token<Object> = createToken('DevSecrets');
export const SecretsLocationToken: Token<string> = createToken(
  'SecretsLocation'
);
