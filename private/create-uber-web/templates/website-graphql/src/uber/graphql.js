// @flow
import type FusionApp from 'fusion-core';
import {
  ApolloClientToken,
  GraphQLSchemaToken,
  ApolloClientPlugin,
  GetApolloClientLinksToken,
} from 'fusion-plugin-apollo';
import GraphQLDevPlugin, {GraphQLDevToken} from '@uber/graphql-scripts';
import registerPlugins from '../__generated__/register-plugins';
import registerGraphQLPlugins from '../__generated__/register-graphql-plugins';
import registerGraphQLLinks from '../__generated__/register-graphql-links';

import GraphQLSchemaPlugin from '../graphql/index.js';

import GraphQLMetricsPlugin from '@uber/fusion-plugin-graphql-metrics';

export default function initGraphQL(app: FusionApp) {
  app.register(ApolloClientToken, ApolloClientPlugin);
  if (__NODE__) {
    // $FlowFixMe
    app.middleware(require('koa-bodyparser')());
    app.register(GetApolloClientLinksToken, GraphQLMetricsPlugin);
    app.register(GraphQLSchemaToken, GraphQLSchemaPlugin);
    app.register(GraphQLDevToken, GraphQLDevPlugin);
    registerPlugins(app);
    registerGraphQLPlugins(app);
    registerGraphQLLinks(app);
  }
}
