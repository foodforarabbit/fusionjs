/* eslint-env node */
import util from 'util';
import fs from 'fs';
import path from 'path';

import dottie from 'dottie';
import {Plugin} from '@uber/graphene-plugin';

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
  return class extends Plugin {
    static of() {
      // Singleton only, we don't care about scoping for ctx (similarly, we wouldn't want/need to init per request)
      return super.of();
    }

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
  };
};
