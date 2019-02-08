// @flow
import type {FusionPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import HeatpipePublisher from '@uber/node-heatpipe-publisher';

export type TopicInfoType = {
  topic: string,
  version: number,
};
export type MessageType = {[string]: any};
export type EventPayload = {
  topicInfo: TopicInfoType,
  message: MessageType,
};

export type HeatpipeClientType = HeatpipePublisher;

export type HeatpipePluginServiceType = {
  asyncPublish: (TopicInfoType, MessageType) => Promise<void>,
  publish: (TopicInfoType, MessageType) => Error | void,
  destroy: (cb?: () => void) => void,
};

export type HeatpipePluginDepsType = {
  events: typeof UniversalEventsToken,
  heatpipeConfig?: HeatpipeConfigType,
  M3?: typeof M3Token,
  Logger?: typeof LoggerToken,
  Client?: HeatpipeClientType,
};

export type HeatpipePluginType = FusionPlugin<
  HeatpipePluginDepsType,
  HeatpipePluginServiceType
>;

export type HeatpipeConfigType = {
  appId?: string,
  schemaService?: {
    host: string,
    port: number,
  },
  kafka?: {
    proxyHost: string,
    proxyPort: number,
    maxRetries: number,
  },
  exact?: boolean,
  debugMode?: boolean,
  publishToKafka?: boolean,
};
