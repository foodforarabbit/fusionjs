import Atreyu from '@uber/atreyu';
import {SingletonPlugin} from 'fusion-plugin';

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
        logger: Logger.of().createChild('atreyu'),
        tracer: Tracer.of().tracer,
        galileo: Galileo.of().galileo,
        channelsOnInit: true,
        hyperbahnClient: TChannel.of().hyperbahn,
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
