/* eslint-env node */
import assert from 'assert';
import Flipr from '@uber/flipr-client';
import os from 'os';
import path from 'path';
import {Plugin} from '@uber/graphene-plugin';

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

export default ({config, Logger}) => {
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

  assert(
    defaultNamespace || propertiesNamespaces,
    'Specify your namespaces with either `defaultNamespace` or `propertiesNamespaces`'
  );

  assert(
    !Logger || (Logger && Logger.of),
    'Provided Logger plugin interface unknown'
  );
  const logger = (Logger && Logger.of()) || null;

  class FliprPlugin extends Plugin {
    static of() {
      return super.of();
    }

    constructor(ctx) {
      super(ctx);
      const flipr = new Flipr({
        propertiesNamespaces:
          (defaultNamespace &&
            getFliprPropertiesNamespaces({
              rootNamespace: defaultNamespace,
              dataCenter,
            })) ||
            propertiesNamespaces,
        logger,
        dcPath: getFliprDatacenterPath(),
        updateInterval: updateInterval || 5000,
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

  return FliprPlugin;
};
