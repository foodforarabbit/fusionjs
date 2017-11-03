/* eslint-env node */
import fs from 'fs';
import path from 'path';

import dottie from 'dottie';
import {SingletonPlugin} from 'fusion-core';

export default (
  {
    devValues,
    secretsPath = path.join(process.cwd(), 'config/secrets/secrets.json'),
  } = {}
) => {
  if (__DEV__ && !devValues) {
    throw new Error('devValues are required in development');
  }
  let secrets;
  try {
    secrets = __DEV__ ? devValues : JSON.parse(fs.readFileSync(secretsPath));
  } catch (e) {
    throw new Error(`Failed to parse secrets at ${secretsPath}`);
  }
  class SecretService {
    constructor() {}
    get(...args) {
      return dottie.get.call(null, secrets, ...args);
    }
  }
  return new SingletonPlugin({Service: SecretService});
};
