/* eslint-env node */
import Galileo from '@uber/galileo';
import {opentracing} from 'jaeger-client';
import {SingletonPlugin} from '@uber/graphene-plugin';

// eslint-disable-next-line no-unused-vars
export default function createGalileoPlugin({
  Logger,
  Tracer,
  config = {},
  GalileoClient = Galileo,
}) {
  const logger = Logger.of().createChild('galileo');
  const tracer = Tracer.of().tracer;
  const galileoConfig = {
    appName: config.appName,
    galileo: config.galileo || {},
  };

  const galileo = new GalileoClient(
    galileoConfig,
    tracer,
    opentracing.FORMAT_HTTP_HEADERS,
    logger
  );

  class GalileoPlugin extends SingletonPlugin {
    constructor(ctx) {
      super(ctx);
      this.galileo = galileo;
    }

    static destroy() {
      const {wonkaClient} = galileo;
      if (wonkaClient) {
        wonkaClient.destroy();
      }
      return true;
    }
  }

  return GalileoPlugin;
}
