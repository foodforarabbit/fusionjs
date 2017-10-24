/* eslint-env node */
import Galileo from '@uber/galileo';
import {opentracing} from 'jaeger-client';
import {SingletonPlugin} from '@uber/graphene-plugin';

// eslint-disable-next-line no-unused-vars
export default function createGalileoPlugin({
  Logger,
  Tracer,
  config,
  GalileoClient = Galileo,
}) {
  const logger = Logger.of().createChild('galileo');
  const tracer = Tracer.of().client();

  class GalileoPlugin extends SingletonPlugin {
    constructor() {
      super();
      this.galileo = this.initGalileo(config);
    }

    initGalileo(config) {
      const galileoConfig = {
        appName: config.appName,
        galileo: config.galileo || {},
      };

      return new GalileoClient(
        galileoConfig,
        tracer,
        opentracing.FORMAT_HTTP_HEADERS,
        logger
      );
    }

    client() {
      return this.galileo;
    }

    destroy() {
      const {wonkaClient} = this.galileo;
      if (wonkaClient) {
        wonkaClient.destroy();
      }
      this.galileo = null;
      return true;
    }
  }

  return GalileoPlugin;
}
