/* eslint-env node */
import {LoggerToken, createOptionalToken} from 'fusion-tokens';
import {JaegerClient, initTracer} from '@uber/jaeger-client-adapter';
import {createPlugin, memoize} from 'fusion-core';

export const TracerConfigToken = createOptionalToken('TracerConfig', {});
export const TracerOptionsToken = createOptionalToken('TracerOptions', {});
export const InitTracerToken = createOptionalToken(
  'InitTracerToken',
  initTracer
);

// eslint-disable-next-line no-unused-vars
export default createPlugin({
  deps: {
    logger: LoggerToken,
    config: TracerConfigToken,
    options: TracerOptionsToken,
    initClient: InitTracerToken,
  },
  provides: ({logger, config, options, initClient}) => {
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
      destroy() {
        tracer.close();
        return true;
      },
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
      tags[opentracing.Tags.SPAN_KIND] = opentracing.Tags.SPAN_KIND_RPC_SERVER;
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
});
