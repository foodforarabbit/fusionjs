// @flow

import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

import {TChannelClientToken} from './tokens.js';
import type {FusionPlugin} from 'fusion-core';

export type TChannelDepsType = {
  logger: typeof LoggerToken,
  m3: typeof M3Token,
  TChannelClient: typeof TChannelClientToken.optional,
};

export type TChannelType = {[string]: (...args: any) => any};
export type TChannelPluginType = FusionPlugin<
  TChannelDepsType,
  {
    tchannel: TChannelType,
    +cleanup: () => Promise<void>,
  }
>;
