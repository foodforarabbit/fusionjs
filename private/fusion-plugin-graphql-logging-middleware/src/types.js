// @flow

import type {Context} from 'fusion-core';
import type {GraphQLResolveInfo} from 'graphql';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';

export type PluginServiceType = (schema: any) => any;
export type DepsType = {
  logger: typeof LoggerToken,
  m3: typeof M3Token,
  tracer: typeof TracerToken.optional,
};
type ResolveFn = (
  root: any,
  args: any,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<any>;
export type GraphQLMiddlewareType = (
  resolve: ResolveFn,
  root: any,
  args: any,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<any>;
