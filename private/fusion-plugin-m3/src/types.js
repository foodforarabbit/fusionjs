// @flow

import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {M3ClientToken, CommonTagsToken} from './tokens.js';

export type M3DepsType = {
  events: typeof UniversalEventsToken,
  Client: typeof M3ClientToken,
  commonTags: typeof CommonTagsToken,
};

export type TagsType = {
  [string]: mixed,
};

export type M3Type = Class<{
  +scope: TagsType => void,
  +close: () => void,
  +counter: (string, number, TagsType) => void,
  +increment: (string, number, TagsType) => void,
  +decrement: (string, number, TagsType) => void,
  +timing: (string, number, TagsType) => void,
  +gauge: (string, number, TagsType) => void,
  +immediateCounter: (string, number, TagsType) => void,
  +immediateIncrement: (string, number, TagsType) => void,
  +immediateDecrement: (string, number, TagsType) => void,
  +immediateTiming: (string, number, TagsType) => void,
  +immediateGauge: (string, number, TagsType) => void,
}>;

export type ServiceType = {
  counter: (string, ?number, ?TagsType) => void,
  increment: (string, ?TagsType) => void,
  decrement: (string, ?TagsType) => void,
  timing: (string, ?number, ?TagsType) => void,
  gauge: (string, ?number, ?TagsType) => void,
  scope: string => void,
  immediateCounter: (string, ?number, ?TagsType) => void,
  immediateIncrement: (string, ?TagsType) => void,
  immediateDecrement: (string, ?TagsType) => void,
  immediateTiming: (string, ?number, ?TagsType) => void,
  immediateGauge: (string, ?number, ?TagsType) => void,
  close: string => Promise<void>,
};
