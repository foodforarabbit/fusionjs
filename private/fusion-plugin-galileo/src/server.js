/* eslint-env node */
import Galileo from '@uber/galileo';
import {JaegerClient} from '@uber/jaeger-client-adapter';
import {createPlugin} from 'fusion-core';
import {LoggerToken, createOptionalToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

export const ConfigToken = createOptionalToken('GalileoConfig', {});
export const ClientToken = createOptionalToken('GalileoClient', null);

// eslint-disable-next-line no-unused-vars
export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
      Tracer: TracerToken,
      config: ConfigToken,
      Client: ClientToken,
    },
    provides: ({m3, logger, Tracer, config, Client}) => {
      Client = Client || Galileo;
      logger = logger.createChild('galileo');
      const tracer = Tracer.tracer;
      const galileoConfig = {
        appName: process.env.SVC_ID || 'dev-service',
        galileo: config,
      };

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
  });
