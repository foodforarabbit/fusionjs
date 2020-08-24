// @flow

import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {M3ClientToken, CommonTagsToken} from './tokens.js';

export type M3DepsType = {
  events: typeof UniversalEventsToken,
  Client?: typeof M3ClientToken,
  commonTags?: typeof CommonTagsToken,
};

export type M3BrowserDepsType = {
  events: typeof UniversalEventsToken,
};

export type TagsType = {
  [string]: mixed,
};

export type M3Type = Class<{
  +scope: TagsType => M3Type,
  +close: () => void,
  +counter: (string, number, TagsType) => void,
  +increment: (string, number, TagsType) => void,
  +decrement: (string, number, TagsType) => void,
  +timing: (string, number | Date, TagsType) => void,
  +gauge: (string, number, TagsType) => void,
  +immediateCounter: (string, number, TagsType) => void,
  +immediateIncrement: (string, number, TagsType) => void,
  +immediateDecrement: (string, number, TagsType) => void,
  +immediateTiming: (string, number | Date, TagsType) => void,
  +immediateGauge: (string, number, TagsType) => void,
}>;

export type ServiceType = {
  counter: (string, ?number, ?TagsType) => void,
  increment: (string, ?TagsType) => void,
  decrement: (string, ?TagsType) => void,
  timing: (string, ?number | ?Date, ?TagsType) => void,
  gauge: (string, ?number, ?TagsType) => void,
  scope: TagsType => ServiceType,
  immediateCounter: (string, ?number, ?TagsType) => void,
  immediateIncrement: (string, ?TagsType) => void,
  immediateDecrement: (string, ?TagsType) => void,
  immediateTiming: (string, ?number | ?Date, ?TagsType) => void,
  immediateGauge: (string, ?number, ?TagsType) => void,
  close: string => Promise<void>,
};

export type BrowserServiceType = {
  counter: (string, number, TagsType) => void,
  increment: (string, TagsType) => void,
  decrement: (string, TagsType) => void,
  timing: (string, number | Date, TagsType) => void,
  gauge: (string, number, TagsType) => void,
};
