/* eslint-env node */
import Atreyu from '@uber/atreyu';
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {
  AtreyuClientToken,
  AtreyuConfigToken,
  AtreyuOptionsToken,
} from './tokens';

export default __NODE__ &&
  createPlugin({
    deps: {
      config: AtreyuConfigToken,
      m3: M3Token,
      logger: LoggerToken,
      tracer: TracerToken,
      galileo: GalileoToken,
      tchannel: TChannelToken,
      options: AtreyuOptionsToken,
      Client: AtreyuClientToken,
    },
    provides({config, m3, logger, tracer, galileo, tchannel, options, Client}) {
      Client = Client || Atreyu;
      config = Object.assign(
        {},
        {
          appName: process.env.SVC_ID || 'dev-service',
        },
        config
      );
      return new Client(config, {
        m3,
        logger,
        tracer,
        galileo,
        channelsOnInit: true,
        hyperbahnClient: tchannel ? tchannel.hyperbahn : null,
        ...options,
      });
    },
  });
