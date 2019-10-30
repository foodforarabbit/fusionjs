// @flow
/* eslint-disable no-unused-vars*/
const {GalileoToken} = require('@uber/fusion-plugin-galileo');
const {LoggerToken} = require('fusion-tokens');
const {TracerToken} = require('@uber/fusion-plugin-tracer');
const {M3Token} = require('@uber/fusion-plugin-m3');

const {ProxyConfigToken} = require('./tokens');

/*::
import type {FusionPlugin} from 'fusion-core';

export type ProxyConfigType = {
  [name: string]: ProxyConfigItemType,
};

export type ProxyConfigItemType = {
  uri: string,
  headers?: {[string]: string},
  routes: Array<ProxyConfigItemRouteType>,
};

export type ProxyConfigItemRouteType = {
  route: string,
  m3Key?: string,
  headers?: {[string]: string},
};

export type TransformedProxyConfigType = ProxyConfigItemType & {
  name: string,
  m3Key?: string,
};

export type ProxyCompatPluginDepsType = {
  config: typeof ProxyConfigToken,
  logger: typeof LoggerToken,
  m3Client: typeof M3Token,
  Tracer: typeof TracerToken.optional,
  Galileo: typeof GalileoToken.optional,
};

export type ProxyCompatPluginType = FusionPlugin<ProxyCompatPluginDepsType, void>;
*/

/* eslint-enable */
