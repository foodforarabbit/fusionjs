// @flow
/* eslint-env node */
import os from 'os';
import path from 'path';

import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import type {Logger} from 'fusion-tokens';

import {FliprClientToken, FliprConfigToken} from './tokens.js';
import type {
  FliprPluginType,
  FliprServiceType,
  FliprConfigType,
  FliprClientType,
} from './types.js';

function getFliprPropertiesNamespaces({
  rootNamespace,
  dataCenter,
}): Array<string> {
  return [
    rootNamespace,
    `${rootNamespace}.${dataCenter || 'local'}`,
    `${rootNamespace}.${os.hostname()}`,
  ];
}

function getFliprDatacenterPath(): string | null {
  return __DEV__ ? path.join(__dirname, '../flipr/local_datacenter') : null;
}

function getFliprDiskCachePath(): string | null {
  return __DEV__ ? path.join(__dirname, '../flipr/') : null;
}

export const DEFAULT_UPDATE_INTERVAL = 5000;

export class FliprService {
  constructor(
    config: FliprConfigType,
    logger: Logger,
    Client: FliprClientType
  ) {
    // Plugin config properties
    // @uber/flipr-client config properties
    const {
      defaultNamespace,
      dataCenter,
      overrides,
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
      if (flipr[key] instanceof Function) {
        // $FlowFixMe
        const func = flipr[key].bind(flipr);
        Object.defineProperty(this, key, {
          value: (...args): any => func(...args),
        });
      }
    }

    if (flipr.startUpdating instanceof Function) {
      flipr.startUpdating(function onUpdating(err): void {
        if (err) {
          throw err;
        }
      });
    }
  }
}

const pluginFactory: () => FliprPluginType = () =>
  createPlugin({
    deps: {
      config: FliprConfigToken.optional,
      logger: LoggerToken,
      Client: FliprClientToken.optional,
    },

    provides: ({config = {}, logger, Client}): FliprServiceType => {
      // The flipr client pulls in bignum which causes some problems
      // when used with jest. To resolve this, we can lazy load the flipr client
      Client = Client || require('@uber/flipr-client');
      const fliprClientConfig = {
        defaultNamespace: process.env.SVC_ID,
        diskCachePath: (__DEV__ && 'flipr') || null,
        ...config,
      };

      return new FliprService(fliprClientConfig, logger, Client);
    },
    // $FlowFixMe
    cleanup: (flipr: FliprServiceType) => flipr.destroy(),
  });

export default ((__NODE__ && pluginFactory(): any): FliprPluginType);
