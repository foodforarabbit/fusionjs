// @flow
/* eslint-env node */
import os from 'os';
import path from 'path';

import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

import {FliprClientToken, FliprConfigToken} from './tokens';

function getFliprPropertiesNamespaces({rootNamespace, dataCenter}) {
  return [
    rootNamespace,
    `${rootNamespace}.${dataCenter || 'local'}`,
    `${rootNamespace}.${os.hostname()}`,
  ];
}

function getFliprDatacenterPath() {
  return __DEV__ ? path.join(__dirname, '../flipr/local_datacenter') : null;
}

function getFliprDiskCachePath() {
  return __DEV__ ? path.join(__dirname, '../flipr/') : null;
}

export const DEFAULT_UPDATE_INTERVAL = 5000;

class FliprService {
  constructor(config, logger, Client) {
    const {
      // Plugin config properties
      defaultNamespace,
      dataCenter,
      overrides,
      // @uber/flipr-client config properties
      propertiesNamespaces,
      updateInterval,
      defaultProperties,
      diskCachePath,
    } = config;

    const flipr = new Client({
      propertiesNamespaces:
        (defaultNamespace &&
          getFliprPropertiesNamespaces({
            rootNamespace: defaultNamespace,
            dataCenter,
          })) ||
        propertiesNamespaces,
      logger,
      dcPath: getFliprDatacenterPath(),
      updateInterval: updateInterval || DEFAULT_UPDATE_INTERVAL,
      defaultProperties,
      diskCachePath: diskCachePath || getFliprDiskCachePath(),
      ...overrides,
    });

    for (const key in flipr) {
      if (typeof flipr[key] === 'function') {
        Object.defineProperty(this, key, {
          value: (...args) => flipr[key](...args),
        });
      }
    }

    flipr.startUpdating(function onUpdating(err) {
      if (err) {
        throw err;
      }
    });
  }
}

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      config: FliprConfigToken.optional,
      logger: LoggerToken,
      Client: FliprClientToken.optional,
    },
    provides: ({config = {}, logger, Client}) => {
      // The flipr client pulls in bignum which causes some problems
      // when used with jest. To resolve this, we can lazy load the flipr client
      Client = Client || require('@uber/flipr-client');
      const fliprClientConfig = {
        defaultNamespace: process.env.SVC_ID,
        diskCachePath: __DEV__ && 'flipr',
        ...config,
      };

      return new FliprService(fliprClientConfig, logger, Client);
    },
    cleanup: flipr => flipr.destroy(),
  });

export default plugin;
