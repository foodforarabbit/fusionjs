// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {JaegerClient} from '@uber/jaeger-client';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

import {
  GalileoConfigToken as ConfigToken,
  GalileoClientToken as ClientToken,
} from './tokens.js';
import type {
  GalileoServiceType,
  GalileoPluginType,
  GalileoClient,
} from './types.js';

function getAppName() {
  return __DEV__ ? process.env.UBER_OWNER : process.env.SVC_ID;
}

const pluginFactory: () => GalileoPluginType = (): GalileoPluginType =>
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
      Tracer: TracerToken,
      config: ConfigToken.optional,
      Client: ClientToken.optional,
    },

    provides: ({
      m3,
      logger,
      Tracer,
      config = {},
      Client,
    }): GalileoServiceType => {
      // $FlowFixMe
      logger = logger.createChild('galileo');
      const tracer = Tracer.tracer;
      const {appName = getAppName(), ...overrides} = config;
      const galileoConfig = {
        appName,
        galileo: {
          enabled: true,
          allowedEntities: ['EVERYONE'],
          enforcePercentage: 0.0,
          wonkamasterUrl: __DEV__ && 'https://wonkabar.uberinternal.com',
          ...overrides,
        },
      };
      if (!galileoConfig.galileo.enabled) {
        return {galileo: null, destroy(): void {}};
      }
      Client = Client || require('@uber/unpm-galileo');
      const galileo = new Client(
        galileoConfig,
        tracer,
        JaegerClient.opentracing.FORMAT_HTTP_HEADERS,
        logger,
        m3
      );

      class GalileoPlugin {
        galileo: GalileoClient;
        constructor() {
          this.galileo = galileo;
        }
        destroy(): boolean {
          const {wonkaClient} = galileo;
          if (wonkaClient) {
            wonkaClient.destroy();
          }
          return true;
        }
      }
      return new GalileoPlugin();
    },

    cleanup: async (galileoPlugin: GalileoServiceType): Promise<void> => {
      galileoPlugin.destroy();
    },
  });
export default ((__NODE__ && pluginFactory(): any): GalileoPluginType);
