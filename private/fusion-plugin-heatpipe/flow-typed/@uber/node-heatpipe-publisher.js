// @flow
declare module '@uber/node-heatpipe-publisher' {
  declare type Options = {
    appId: string,
    statsd: any,
    logger: any,
    kafka: {
      proxyHost: string,
      proxyPort: number,
      maxRetries: number,
    },
    schemaService: {
      host: string,
      port: number,
    },
    exact: boolean,
    debugMode: boolean,
    publishToKafka: boolean,
  };

  declare type TopicInfo = {
    topic: string,
    version: number,
  };

  declare type Message = {[string]: any};

  declare type ErrorHandler<T> = (e: Error) => T;

  declare class HeatpipePublisher {
    constructor(options: Options): HeatpipePublisher;
    connect(): void;
    publish<T>(
      topic: TopicInfo,
      message: Message,
      errorHandler: ErrorHandler<T>
    ): T | void;
    destroy(cb: () => void): void;
  }

  declare module.exports: Class<HeatpipePublisher>;
}
