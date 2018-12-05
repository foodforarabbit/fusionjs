// @flow
import {LoggerToken} from 'fusion-tokens';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {M3Token} from '@uber/fusion-plugin-m3';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {FliprToken} from '@uber/fusion-plugin-flipr';

import {InitializeServerToken} from './tokens';

export type BedrockServerType = any;

export type InitializeServerType = (
  BedrockServerType,
  callback?: Function
) => BedrockServerType;

export type BedrockCompatPluginDepsType = {
  initServer: typeof InitializeServerToken.optional,
  logger: typeof LoggerToken,
  atreyu: typeof AtreyuToken,
  m3: typeof M3Token,
  galileo: typeof GalileoToken.optional,
  flipr: typeof FliprToken.optional,
};

export type BedrockCompatPluginServiceType = BedrockServerType;
