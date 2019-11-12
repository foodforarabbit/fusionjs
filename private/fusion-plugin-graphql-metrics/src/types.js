// @flow

import type {Context} from 'fusion-core';
import type {GraphQLResolveInfo} from 'graphql';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {
  GetApolloClientLinksToken,
  GraphQLSchemaToken,
} from 'fusion-plugin-apollo';

export type PluginServiceType = $Call<typeof GetApolloClientLinksToken>;

export type DepsType = {
  logger: typeof LoggerToken,
  m3: typeof M3Token,
  Tracer: typeof TracerToken.optional,
  schema: typeof GraphQLSchemaToken.optional,
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
