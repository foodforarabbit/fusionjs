// @flow

import type {FusionPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

import {GalileoConfigToken, GalileoClientToken} from './tokens.js';

export type GalileoClient = any;

type GalileoDepsType = {
  logger: typeof LoggerToken,
  m3: typeof M3Token,
  Tracer: typeof TracerToken,
  config: typeof GalileoConfigToken.optional,
  Client: typeof GalileoClientToken.optional,
};
type GalileoServiceType = {
  +galileo: GalileoClient,
  +destroy: () => boolean | void,
};
export type GalileoPluginType = FusionPlugin<
  GalileoDepsType,
  GalileoServiceType
>;
