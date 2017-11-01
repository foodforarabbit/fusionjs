/* eslint-env node */
import util from 'util';
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
  if (!__DEV__ && devValues) {
    throw new Error('devValues should not be provided in production');
  }
  if (__DEV__ && !devValues) {
    throw new Error('devValues are required in development');
  }
  class SecretService {
    async init() {
      try {
        this.secrets = __DEV__
          ? devValues
          : JSON.parse(await util.promisify(fs.readFile)(secretsPath));
      } catch (e) {
        throw new Error(`Failed to parse secrets at ${secretsPath}`);
      }
    }
    get(...args) {
      if (this.secrets === undefined) {
        throw new Error('You must call init() before accessing secrets');
      }
      return dottie.get.call(null, this.secrets, ...args);
    }
  }
  return new SingletonPlugin({Service: SecretService});
};
