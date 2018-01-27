import Atreyu from '@uber/atreyu';
import {createPlugin} from 'fusion-core';
import {LoggerToken, createToken, createOptionalToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';

export const AtreyuToken = createToken('AtreyuToken');
export const AtreyuConfigToken = createOptionalToken('AtreyuConfigToken', {});
export const AtreyuOptionsToken = createOptionalToken('AtreyuOptionsToken', {});
export const AtreyuClientToken = createOptionalToken(
  'AtreyuClientToken',
  Atreyu
);

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
      return new Client(
        config,
        Object.assign(
          {
            m3,
            logger,
            tracer,
            galileo,
            channelsOnInit: true,
            hyperbahnClient: tchannel ? tchannel.hyperbahn : null,
          },
          options
        )
      );
    },
  });
