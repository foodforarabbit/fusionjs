import { Plugin } from "@uber/graphene-plugin";

const supportedLevels = [
  "trace",
  "debug",
  "info",
  "access",
  "warn",
  "error",
  "fatal"
];

export default ({ UniversalEvents }) => {
  if (__DEV__) {
    if (!UniversalEvents) {
      throw new Error("UniversalEvents is a required parameter");
    }
  }
  return class UniversalLogger extends Plugin {
    constructor(ctx) {
      super(ctx);
      this.emitter = UniversalEvents.of(ctx);
      supportedLevels.forEach(level => {
        this[level] = (message, meta) => {
          return this.log(level, message, meta);
        };
      });
    }
    log(level, message, meta) {
      // Supports the interface of logger[level](new Error('some-error'));
      if (message instanceof Error) {
        meta = message;
        message = meta.message;
      }
      // Supports the interface of logger[level]('message', new Error('some-error'));
      if (meta instanceof Error) {
        meta = {
          error: meta
        };
      }
      // This is a hack required to make errors be json serializable.
      // There are alternative solutions, such as modifying the global Error prototype,
      // however that is most likely not the responsibility of this library.
      // See: http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
      // for various workarounds
      if (meta && meta.error instanceof Error) {
        const error = {};
        Object.getOwnPropertyNames(meta.error).forEach(propName => {
          error[propName] = meta.error[propName];
        });
        meta.error = error;
      }

      return this.emitter.emit("client-logging", { level, message, meta });
    }
  };
};
