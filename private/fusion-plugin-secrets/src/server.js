// @flow
/* eslint-env node */
import fs from 'fs';

import dottie from 'dottie';
import {createPlugin} from 'fusion-core';
import {DevSecretsToken, SecretsLocationToken} from './tokens';

import type {SecretPluginType} from './types';

declare var __DEV__: boolean;
declare var __NODE__: boolean;

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      devValues: DevSecretsToken.optional,
      secretsPath: SecretsLocationToken.optional,
    },
    provides: deps => {
      const {devValues, secretsPath = 'config/secrets/secrets.json'} = deps;
      if (__DEV__ && !devValues) {
        throw new Error('devValues are required in development');
      }
      let secrets;
      try {
        secrets = __DEV__
          ? devValues
          : JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
      } catch (e) {
        throw new Error(`Failed to parse secrets at ${secretsPath}`);
      }
      return {
        get(...args) {
          return dottie.get.call(null, secrets, ...args);
        },
      };
    },
  });

export default ((plugin: any): SecretPluginType);
