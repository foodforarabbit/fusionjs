// @flow

import type {FusionPlugin, Context} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

import {
  TracerConfigToken,
  TracerOptionsToken,
  InitTracerToken,
} from './tokens.js';

export type Reference = {
  type(): string,
  referencedContext(): SpanContext,
};
export type StartSpanOptions = {
  operationName?: string,
  childOf?: SpanContext,
  references?: Array<Reference>,
  tags?: any,
  startTime?: number,
};

export type SpanContext = {
  traceId: any,
  spanId: any,
  parentId: any,
  traceIdStr: ?string,
  spanIdStr: ?string,
  parentIdStr: ?string,
  flags: number,
  baggage: any,
  debugId: ?string,
  samplingFinalized: boolean,
  isValid: boolean,
  finalizeSampling(): void,
  isDebugIDContainerOnly(): boolean,
  isSampled(): boolean,
  isDebug(): boolean,
  withBaggageItem(key: string, value: string): SpanContext,
  fromString(serializedString: string): any,
  withBinaryIds(
    traceId: any,
    spanId: any,
    parentId: any,
    flags: number,
    baggage: any,
    debugId: ?string
  ): SpanContext,

  withStringIds(
    traceIdStr: any,
    spanIdStr: any,
    parentIdStr: any,
    flags: number,
    baggage: any,
    debugId: ?string
  ): SpanContext,
};

export type Span = {
  operationName: string,
  serviceName: string,
  setBaggageItem(key: string, value: string): Span,
  getBaggageItem(key: string): string,
  context(): SpanContext,
  tracer(): Tracer,
  setOperationName(operationName: string): Span,
  finish(finishTime: ?number): void,
  addTags(keyValuePairs: any): Span,
  setTag(key: string, value: any): Span,
  log(keyValuePairs: any, timestamp: ?number): Span,
  logEvent(eventName: string, payload: any): void,
};

export type Tracer = {
  startSpan(operationName: string, options: ?StartSpanOptions): Span,
  inject(spanContext: SpanContext | Span, format: string, carrier: any): void,
  extract(format: string, carrier: any): SpanContext,
  close(callback: Function): void,
  now(): number,
};

export type TracerDepsType = {
  logger: typeof LoggerToken,
  config: typeof TracerConfigToken.optional,
  options: typeof TracerOptionsToken.optional,
  initClient: typeof InitTracerToken.optional,
};
export type TracerServiceType = {
  tracer: Tracer,
  from: (
    ctx: Context
  ) => {
    span: Span,
    tracer: Tracer,
  },
};
export type TracerPluginType = FusionPlugin<TracerDepsType, TracerServiceType>;
