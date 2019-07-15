// @flow

/* eslint-env node */

import {JaegerClient, initTracer} from '@uber/jaeger-client-adapter';

import {LoggerToken} from 'fusion-tokens';
import {createPlugin, memoize} from 'fusion-core';

import {
  TracerConfigToken,
  TracerOptionsToken,
  InitTracerToken,
} from './tokens.js';

import type {TracerPluginType} from './types.js';

const pluginFactory: () => TracerPluginType = () =>
  createPlugin({
    deps: {
      logger: LoggerToken,
      config: TracerConfigToken.optional,
      options: TracerOptionsToken.optional,
      initClient: InitTracerToken.optional,
    },
    provides: ({
      logger,
      config = {},
      options = {},
      initClient = initTracer,
    }) => {
      // $FlowFixMe
      options.logger = options.logger || logger.createChild('tracer');

      const {mock, ...tracerConfig} = config;

      if (mock) {
        options.reporter = new JaegerClient.InMemoryReporter();
        config.sampler = {
          type: 'const',
          param: 1,
        };
      }

      if (!tracerConfig.serviceName) {
        tracerConfig.serviceName = process.env.SVC_ID || 'dev-service';
      }

      const tracer = initClient(tracerConfig, options);

      return {
        tracer,
        from: memoize(() => {
          return {
            tracer,
            // $FlowFixMe
            span: null,
          };
        }),
      };
    },
    middleware: (deps, tracerContainer) => {
      const {opentracing} = JaegerClient;
      const {tracer} = tracerContainer;
      return async function middleware(ctx, next) {
        const {request} = ctx;
        const context = tracer.extract(
          opentracing.FORMAT_HTTP_HEADERS,
          request.headers
        );

        const tags = {};
        tags[opentracing.Tags.COMPONENT] = 'fusion';
        tags[opentracing.Tags.SPAN_KIND] =
          opentracing.Tags.SPAN_KIND_RPC_SERVER;
        tags[opentracing.Tags.HTTP_URL] = request.path;
        tags[opentracing.Tags.HTTP_METHOD] = request.method;
        tags[opentracing.Tags.PEER_SERVICE] = 'web_client';

        // TODO: Normalize path to remove unique identifiers
        const span = tracer.startSpan(`${request.method}_${request.path}`, {
          childOf: context,
          tags: tags,
        });

        tracerContainer.from(ctx).span = span;

        ctx.timing.end.then(() => {
          span.setTag(opentracing.Tags.HTTP_STATUS_CODE, ctx.response.status);
          span.finish();
        });

        return next();
      };
    },
    cleanup: tracer => new Promise(resolve => tracer.tracer.close(resolve)),
  });

export default ((__NODE__ && pluginFactory(): any): TracerPluginType);
