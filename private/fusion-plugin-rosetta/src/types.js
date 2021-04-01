// @flow
import type {Context} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {ClientToken, ConfigToken, LocaleNegotiationToken, GetTranslationsToken} from './tokens';
// $FlowFixMe
import Rosetta from '@uber/node-rosetta';

export type RosettaDepsType = {
  logger: typeof LoggerToken,
  Client: typeof ClientToken.optional,
  config: typeof ConfigToken.optional,
  localeNegotiation: typeof LocaleNegotiationToken.optional,
  getTranslations: typeof GetTranslationsToken.optional,
};
export type RosettaType = Rosetta;

export type RosettaClientType = typeof Rosetta;
export type RosettaConfigType = {
  service: string,
  fixturesDir?: string,
};
export type RosettaLocaleNegotiationType = (Context, any) => any;
export type RosettaGetTranslationsType = (client: any, locale: any) => any;

export type TranslationsType = {[key: string]: string}

export type RosettaServiceType = {
  from: (
    ctx: Context
  ) => {
    locale: any,
    translations: TranslationsType,
  },
};

export type InternalRosettaServiceType = {
  client: RosettaType,
  from: (
    ctx: Context
  ) => {
    locale: any,
    translations: TranslationsType,
  },
};
