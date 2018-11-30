// @flow
import type {FusionPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export type TopicInfoType = {
  topic: string,
  version: number,
};
export type MessageType = any;

export type HeatpipeClientType = Class<HeatpipeClientServiceType>;

export interface HeatpipeClientServiceType {
  +constructor: any => any;
  +connect: any => any;
  +publish: (TopicInfoType, MessageType, callback?: Function) => any;
  +destroy: (callback?: Function) => any;
}

export type HeatpipePluginServiceType = {
  asyncPublish: (TopicInfoType, MessageType) => Promise<any>,
  publish: $Call<<T>({+publish: T}) => T, HeatpipeClientServiceType>,
  destroy?: $Call<<T>({+destroy: T}) => T, HeatpipeClientServiceType>,
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
