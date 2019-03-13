// @flow
import type {FusionPlugin} from 'fusion-core';
import {FetchToken, LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export type TopicInfoType = {
  topic: string,
  version: number,
};

export type MessageType = {[string]: any};

export type EventPayload = {
  topicInfo: TopicInfoType,
  message: MessageType,
};

/*
  For a list of all response codes, see:
  https://code.uberinternal.com/diffusion/WEWEBGU/browse/master/idl/code.uber.internal/web/web-heatpipe/webheatpipe.proto$29-32
*/
export type PublishResponse = {
  code: number,
  msg: string,
};

export type HeatpipePluginServiceType = {
  asyncPublish: (TopicInfoType, MessageType) => Promise<void>,
  publish: (TopicInfoType, MessageType) => Error | void,
};

export type HeatpipePluginDepsType = {
  events: typeof UniversalEventsToken,
  fetch?: typeof FetchToken,
  Logger?: typeof LoggerToken,
};

export type HeatpipePluginType = FusionPlugin<
  HeatpipePluginDepsType,
  HeatpipePluginServiceType
>;
