/* eslint-env node */
import {JaegerClient} from '@uber/jaeger-client-adapter';
import {createPlugin, createToken} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

export const ConfigToken = createToken('GalileoConfig');
export const ClientToken = createToken('GalileoClient');

// eslint-disable-next-line no-unused-vars
export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
      Tracer: TracerToken,
      config: ConfigToken.optional,
      Client: ClientToken.optional,
    },
    provides: ({m3, logger, Tracer, config = {}, Client}) => {
      logger = logger.createChild('galileo');
      const tracer = Tracer.tracer;
      let appName = __DEV__ ? process.env.UBER_OWNER : process.env.SVC_ID;
      const galileoConfig = {
        appName,
        galileo: {
          enabled: true,
          allowedEntities: ['EVERYONE'],
          enforcePercentage: 0.0,
          wonkamasterUrl: __DEV__ && 'https://wonkabar.uberinternal.com',
          ...config,
        },
      };
      if (!galileoConfig.galileo.enabled) {
        return {galileo: null, destroy() {}};
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
        constructor() {
          this.galileo = galileo;
        }

        destroy() {
          const {wonkaClient} = galileo;
          if (wonkaClient) {
            wonkaClient.destroy();
          }
          return true;
        }
      }
      return new GalileoPlugin();
    },
    cleanup: galileoPlugin => galileoPlugin.destroy(),
  });
