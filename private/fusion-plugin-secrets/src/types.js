// @flow
import {DevSecretsToken, SecretsLocationToken} from './tokens';
import type {FusionPlugin} from 'fusion-core';

export type SecretServiceType = {
  get: (...args: Array<Array<string> | string>) => any,
};
export type SecretDepsType = {
  devValues?: typeof DevSecretsToken.optional,
  secretsPath?: typeof SecretsLocationToken.optional,
};

export type SecretPluginType = FusionPlugin<SecretDepsType, SecretServiceType>;
