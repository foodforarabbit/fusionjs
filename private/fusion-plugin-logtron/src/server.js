import path from "path";
import Logtron from "@uber/logtron";
import LoggerStream from "@uber/logtron/backends/logger-stream";
import winston from "winston";
import { Plugin } from "@uber/graphene-plugin";
import bodyparser from "koa-bodyparser";
import createErrorTransform from "./create-error-transform";
import { html } from "@uber/graphene-app";

const InMemory = winston.transports.Memory;

const supportedLevels = [
  "trace",
  "debug",
  "info",
  "access",
  "warn",
  "error",
  "fatal"
];

function validateItem(item) {
  item = item || {};
  const { level, message } = item;
  if (!level || !supportedLevels.includes(level)) {
    return false;
  }
  if (typeof message !== "string") {
    return false;
  }
  return true;
}

class InMemoryLogger {
  createStream() {
    return new LoggerStream(new InMemory({ json: true }), {});
  }
}

export default ({ UniversalEvents, config }) => {
  const parseBody = bodyparser();
  return class UniversalLogger extends Plugin {
    constructor() {
      this.logger = Logtron({
        meta: config.meta,
        backends: backends,
        env: config.env
      });
      const backends = Logtron.defaultBackends(config);
      // TODO: We can maybe remove this, since testing can be done via listening to
      // the server events.
      if (config.memory) {
        // This takes the console transport and replaces it with a memory transport
        // access at: logger.mainLogger.streams.console.logger.writeOutput
        backends.console = new InMemoryLogger();
      }
    }
    static async middleware(ctx, next) {
      if (ctx.path === "/_errors" || ctx.path === "/_events") {
        const transformError = await createErrorTransform({
          path: path.join(process.cwd(), `.framework/dist/${ctx.env}/client`),
          ext: ".map"
        });

        if (ctx.path === "/_events") {
          const events = UniversalEvents.of(ctx);
          events.on("client-logging", payload => {
            if (validateItem(payload)) {
              const { level, message } = payload;
              let { meta } = payload;
              if (isErrorMeta(meta)) {
                meta = transformError(meta);
              }
              logger[level](message, meta);
            } else {
              const error = new Error(
                `Invalid data in client request for client-logging`
              );
              logger.error(error.message, error);
            }
          });
        } else if (ctx.path === "/_errors") {
          await parseBody(ctx, () => Promise.resolve());
          const body = ctx.request.body;
          if (!body.error && (!body.message || !body.source || !body.line)) {
            const error = new Error("Invalid browser error report");
            error.status = 400;
            error.body = req.body;
          } else {
            const logger = UniversalLogger.of(ctx);
            logger.error("Browser Exception Report", transformError(body));
          }
        } else if (ctx.element) {
          ctx.body.head.push(html`
            <script>
            window.onerror = function(m,s,l,c,e) {
              var d = {message:m,source:s,line:l,col:c,error:e},x = new XMLHttpRequest;
              x.open('POST', '${ctx.routePrefix}/_error');
              x.setRequestHeader('Content-Type', 'application/json');
              x.send(JSON.stringify(d,Object.keys(d).concat(Object.getOwnPropertyNames(e||{}))));
            }</script>
          `);
        }
      }
      return next();
    }
  };
};
