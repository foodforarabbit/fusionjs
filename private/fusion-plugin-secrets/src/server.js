/* eslint-env node */
import fs from 'fs';
import path from 'path';

import dottie from 'dottie';
import {createOptionalToken} from 'fusion-tokens';
import {createPlugin} from 'fusion-core';

export const DevSecretsToken = createOptionalToken('DevSecrets', null);
export const SecretsLocationToken = createOptionalToken(
  'SecretsLocation',
  path.join(process.cwd(), 'config/secrets/secrets.json')
);

export default createPlugin({
  deps: {
    devValues: DevSecretsToken,
    secretsPath: SecretsLocationToken,
  },
  provides: deps => {
    const {devValues, secretsPath} = deps;
    if (__DEV__ && !devValues) {
      throw new Error('devValues are required in development');
    }
    let secrets;
    try {
      secrets = __DEV__ ? devValues : JSON.parse(fs.readFileSync(secretsPath));
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
