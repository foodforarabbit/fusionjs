// @flow
/* eslint-env node */
import Atreyu from '@uber/atreyu';
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {promisify} from 'util';
import {
  AtreyuClientToken,
  AtreyuConfigToken,
  AtreyuOptionsToken,
} from './tokens';

import type {FusionPlugin} from 'fusion-core';
import type {AtreyuDepsType, AtreyuType} from './types.js';

export default ((__NODE__ &&
  createPlugin<AtreyuDepsType, AtreyuType>({
    deps: {
      config: AtreyuConfigToken.optional,
      options: AtreyuOptionsToken.optional,
      Client: AtreyuClientToken.optional,
      m3: M3Token,
      logger: LoggerToken,
      tracer: TracerToken.optional,
      galileo: GalileoToken.optional,
      tchannel: TChannelToken,
    },
    provides({
      config = {},
      options = {},
      m3,
      logger,
      tracer,
      galileo,
      tchannel,
      Client = Atreyu,
    }) {
      config = Object.assign(
        {},
        {
          appName: process.env.SVC_ID || 'dev-service',
        },
        config
      );
      const client = new Client(config, {
        m3,
        logger,
        tracer: tracer ? tracer.tracer : null,
        galileo: galileo ? galileo.galileo : null,
        channelsOnInit: true,
        hyperbahnClient: tchannel ? tchannel.hyperbahn : null,
        ...options,
      });
      client.createAsyncGraph = (...args) => {
        const graph = client.createGraph(...args);
        return promisify(graph.resolve.bind(graph));
      };
      client.createAsyncRequest = (...args) => {
        const request = client.createRequest(...args);
        return promisify(request.resolve.bind(request));
      };
      return client;
    },
    cleanup: atreyu => atreyu.cleanup(),
  }): any): FusionPlugin<AtreyuDepsType, AtreyuType>);
