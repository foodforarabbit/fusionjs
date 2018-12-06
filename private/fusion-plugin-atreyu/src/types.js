// @flow
import Atreyu from '@uber/atreyu';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {
  AtreyuClientToken,
  AtreyuConfigToken,
  AtreyuOptionsToken,
} from './tokens';

export type AtreyuDepsType = {
  config: typeof AtreyuConfigToken.optional,
  options: typeof AtreyuOptionsToken.optional,
  Client: typeof AtreyuClientToken.optional,
  m3: typeof M3Token,
  logger: typeof LoggerToken,
  tracer: typeof TracerToken.optional,
  galileo: typeof GalileoToken.optional,
  tchannel: typeof TChannelToken,
};

export type AtreyuType = typeof Atreyu & {
  createAsyncGraph: Object => (...any) => Promise<any>,
  createAsyncRequest: Object => (...any) => Promise<any>,
};
