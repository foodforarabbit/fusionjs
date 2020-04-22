// @flow
import type FusionApp from 'fusion-core';
import TracerPlugin, {TracerToken} from '@uber/fusion-plugin-tracer';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import AtreyuPlugin, {
  AtreyuToken,
  AtreyuConfigToken,
} from '@uber/fusion-plugin-atreyu';

// configuration
import atreyuConfig from '../config/atreyu';

export default function initDataFetching(app: FusionApp) {
  if (__NODE__) {
    // node specific plugins
    !__DEV__ && app.register(TracerToken, TracerPlugin);
    app.register(TChannelToken, TChannel);
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);
  }
}
