/* eslint-env node */
import Galileo from '@uber/galileo';
import {JaegerClient} from '@uber/jaeger-client-adapter';
import {SingletonPlugin} from 'fusion-core';

// eslint-disable-next-line no-unused-vars
export default function createGalileoPlugin({
  M3,
  Logger,
  Tracer,
  config = {},
  GalileoClient = Galileo,
}) {
  const logger = Logger.of().createChild('galileo');
  const tracer = Tracer.of().tracer;
  const m3 = M3.of();
  const galileoConfig = {
    appName: config.appName,
    galileo: config.galileo || {},
  };

  const galileo = new GalileoClient(
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

  return new SingletonPlugin({Service: GalileoPlugin});
}
