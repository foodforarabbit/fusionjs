import Atreyu from '@uber/atreyu';
import {AtreyuMocker} from '@uber/atreyu-test';
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
        logger: Logger.of().createChild('atreyu'),
        tracer: Tracer.of().tracer,
        galileo: Galileo.of().galileo,
        channelsOnInit: true,
        hyperbahnClient: TChannel.of().hyperbahn,
      },
      options
    )
  );
  const atreyuMocker = new AtreyuMocker(atreyu);

  return new SingletonPlugin({
    Service: function AtreyuPlugin() {
      return atreyuMocker;
    },
  });
};
