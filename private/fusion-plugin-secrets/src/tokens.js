import {createToken, createOptionalToken} from 'fusion-tokens';

export const SecretsToken = createToken('Secrets');
export const DevSecretsToken = createOptionalToken('DevSecrets', null);
export const SecretsLocationToken = createOptionalToken(
  'SecretsLocation',
  'config/secrets/secrets.json'
);
