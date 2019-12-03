// @flow
import type FusionApp from 'fusion-core';
import TracerPlugin, {TracerToken} from '@uber/fusion-plugin-tracer';
import GalileoPlugin, {GalileoToken} from '@uber/fusion-plugin-galileo';
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
    !__DEV__ && app.register(GalileoToken, GalileoPlugin);
    app.register(TChannelToken, TChannel);
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);
  }
}
