/* eslint-env node */
import {JaegerClient, initTracer} from '@uber/jaeger-client-adapter';
import {Plugin} from 'fusion-core';

// eslint-disable-next-line no-unused-vars
export default function createTracerPlugin({
  Logger,
  config = {},
  options = {},
  initClient = initTracer,
}) {
  const {opentracing} = JaegerClient;

  options.logger = options.logger || Logger.of().createChild('tracer');

  const {mock, ...tracerConfig} = config;

  if (mock) {
    options.reporter = new JaegerClient.InMemoryReporter();
  }

  if (!tracerConfig.serviceName) {
    throw new Error(`Missing required configuration 'serviceName'`);
  }

  const tracer = initClient(tracerConfig, options);

  class TracerPlugin {
    constructor() {
      this.span = null;
      this.tracer = tracer;
    }

    destroy() {
      this.tracer.close();
      return true;
    }
  }

  async function middleware(ctx, next) {
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

    this.of(ctx).span = span;

    await next();

    span.setTag(opentracing.Tags.HTTP_STATUS_CODE, ctx.response.status);
    span.finish();
  }

  return new Plugin({middleware, Service: TracerPlugin});
}
