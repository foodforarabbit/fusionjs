// @flow

import {UberWebAnalyticsFliprToken} from './tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import type {FusionPlugin} from 'fusion-core';

export type WebAnalyticsPluginDepsType = {
  flipr?: typeof UberWebAnalyticsFliprToken,
  events?: typeof UniversalEventsToken,
};
export type WebAnalyticsPluginServiceType = {
  createDestinations: void => void,
  track: (
    eventKey: string,
    eventPayload?: Object,
    contextOverride?: Object
  ) => void,
  eventContext: {
    setReduxState: any => void,
  },
};

export type WebAnalyticsPluginType = FusionPlugin<
  WebAnalyticsPluginDepsType,
  WebAnalyticsPluginServiceType
>;

export type ServiceAnalyticsConfig = {
  destinations: {[destinationName: string]: DestinationConfig},
  events: {[rawEventName: string]: EventConfig},
  schemes: {[schemeName: string]: EventResolutionScheme},
};

export type DestinationConfig = {
  type: 'web-heatpipe' | 'm3' | 'tealium' | 'googleAnalytics',
  config?: Object,
};

export type EventDispatchPlan = {
  method: string,
  schemes: Array<string>, // array of scheme names
};

type EventDestinationConfig = Array<EventDispatchPlan>;

type EventConfig = {
  destinations: {[destinationName: string]: EventDestinationConfig},
};

type EventResolutionPrimitives = boolean | number | string | Interpolatable;
type EventResolutionValue =
  | EventResolutionPrimitives
  | {[string]: EventResolutionPrimitives};

type EventResolutionScheme = {
  [propName: string]: EventResolutionValue,
};

type Interpolatable = {
  _interpolatable: true,
  type: 'ref' | 'rpc',
  value: string,
  params?: EventResolutionScheme,
};

type ExtractReturnType = <V>(() => V) => V;
export type IEmitter = $Call<typeof UniversalEventsToken, ExtractReturnType>;
