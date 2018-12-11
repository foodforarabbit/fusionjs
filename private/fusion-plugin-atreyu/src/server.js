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
import type {AtreyuPluginType} from './types.js';
import {
  AtreyuClientToken,
  AtreyuConfigToken,
  AtreyuOptionsToken,
} from './tokens';

const plugin =
  __NODE__ &&
  createPlugin(
    ({
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
      provides: ({
        config = {},
        options = {},
        m3,
        logger,
        tracer,
        galileo,
        tchannel,
        Client = Atreyu,
      }) => {
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
        const atreyuResolve = resolve => {
          return (data, options, ctx) => {
            if (!ctx && options && options.request && options.response) {
              ctx = options;
              options = {};
            }
            if (tracer && ctx) {
              const span = tracer.from(ctx).span;
              options = options || {};
              options.tracing = {span};
            }
            return resolve(data, options);
          };
        };
        client.createAsyncGraph = (...args) => {
          const graph = client.createGraph(...args);
          const graphResolve = promisify(graph.resolve.bind(graph));
          return atreyuResolve(graphResolve);
        };
        client.createAsyncRequest = (...args) => {
          const request = client.createRequest(...args);
          const graphRequest = promisify(request.resolve.bind(request));
          return atreyuResolve(graphRequest);
        };
        return client;
      },
      cleanup: atreyu => atreyu.cleanup(),
    }: any)
  );

export default ((plugin: any): AtreyuPluginType);
