import Atreyu from '@uber/atreyu';
import {SingletonPlugin} from 'fusion-core';

export default (args = {}) => {
  const {
    config,
    options,
    M3,
    TChannel,
    Tracer,
    Galileo,
    Logger,
    Client = Atreyu,
  } = args;
  const atreyu = new Client(
    config,
    Object.assign(
      {
        m3: M3.of(),
        logger: Logger ? Logger.of().createChild('atreyu') : null,
        tracer: Tracer ? Tracer.of().tracer : null,
        galileo: Galileo ? Galileo.of().galileo : null,
        channelsOnInit: true,
        hyperbahnClient: TChannel ? TChannel.of().hyperbahn : null,
      },
      options
    )
  );
  return new SingletonPlugin({
    Service: function AtreyuPlugin() {
      return atreyu;
    },
  });
};
