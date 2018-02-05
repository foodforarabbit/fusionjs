/* eslint-env node */
import {LoggerToken} from 'fusion-tokens';
import {JaegerClient, initTracer} from '@uber/jaeger-client-adapter';
import {createPlugin, memoize, createToken} from 'fusion-core';

export const TracerConfigToken = createToken('TracerConfig');
export const TracerOptionsToken = createToken('TracerOptions');
export const InitTracerToken = createToken('InitTracerToken');

// eslint-disable-next-line no-unused-vars
export default __NODE__ &&
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
      options.logger = options.logger || logger.createChild('tracer');

      const {mock, ...tracerConfig} = config;

      if (mock) {
        options.reporter = new JaegerClient.InMemoryReporter();
      }

      if (!tracerConfig.serviceName) {
        tracerConfig.serviceName = process.env.SVC_ID || 'dev-service';
      }

      const tracer = initClient(tracerConfig, options);

      class TracerPlugin {
        constructor() {
          this.span = null;
          this.tracer = tracer;
        }
      }

      return {
        tracer,
        from: memoize(() => {
          return new TracerPlugin();
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

        const span = tracer.startSpan(`${request.method}_${request.path}`, {
          childOf: context,
          tags: tags,
        });

        tracerContainer.from(ctx).span = span;

        await next();

        span.setTag(opentracing.Tags.HTTP_STATUS_CODE, ctx.response.status);
        span.finish();
      };
    },
    cleanup: tracer => new Promise(resolve => tracer.tracer.close(resolve)),
  });
