// @flow
import type FusionApp from 'fusion-core';
import TracerPlugin, {TracerToken} from '@uber/fusion-plugin-tracer';
import GalileoPlugin, {GalileoToken} from '@uber/fusion-plugin-galileo';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import AtreyuPlugin, {
  AtreyuToken,
  AtreyuConfigToken,
  AtreyuOptionsToken,
} from '@uber/fusion-plugin-atreyu';
import path from 'path';

// configuration
import atreyuConfig from '../config/atreyu';
import sharedAtreyuConfig from '@uber/atreyu-config';

export default function initDataFetching(app: FusionApp) {
  if (__NODE__) {
    const atreyuEnhancer = localConfig => {
      const result = {services: {}};
      Object.keys(localConfig.services).forEach(key => {
        result.services[key] = {...sharedAtreyuConfig.services[key]};
        result.services[key].config = mergeDeep(
          result.services[key].config,
          localConfig.services[key]
        );
      });
      return result;
    };

    const isObject = item => {
      return item && typeof item === 'object' && !Array.isArray(item);
    };

    const mergeDeep = (target, ...sources) => {
      if (!sources.length) return target;
      const source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (const key in source) {
          if (isObject(source[key])) {
            if (!target[key]) Object.assign(target, {[key]: {}});
            mergeDeep(target[key], source[key]);
          } else {
            Object.assign(target, {[key]: source[key]});
          }
        }
      }

      return mergeDeep(target, ...sources);
    };

    // node specific plugins
    !__DEV__ && app.register(TracerToken, TracerPlugin);
    !__DEV__ && app.register(GalileoToken, GalileoPlugin);
    app.register(TChannelToken, TChannel);
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(AtreyuConfigToken, atreyuConfig);
    app.enhance(AtreyuConfigToken, atreyuEnhancer); // TODO: include with scaffold
    app.register(AtreyuOptionsToken, {
      idlFolderPath: path.resolve(process.cwd(), '../../idl/'),
      thriftBasePath: path.resolve(process.cwd(), '../../'),
    }); // TOOD: include with scaffold
  }
}
