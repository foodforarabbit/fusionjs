// @flow
import type {Context} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {ClientToken, ConfigToken, LocaleNegotiationToken} from './tokens';
import Genghis from '@uber/node-genghis';

export type RosettaDepsType = {
  logger: typeof LoggerToken,
  Client: typeof ClientToken.optional,
  config: typeof ConfigToken.optional,
  localeNegotiation: typeof LocaleNegotiationToken.optional,
};
export type RosettaType = Genghis;

export type RosettaClientType = typeof Genghis;
export type RosettaConfigType = {
  service: string,
};
export type RosettaLocaleNegotiationType = (Context, any) => any;
