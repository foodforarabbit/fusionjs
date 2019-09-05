// @flow
import FusionApp, {RenderToken} from 'fusion-core';
import {
  ApolloClientToken,
  GraphQLSchemaToken,
  ApolloClientPlugin,
  GetApolloClientLinksToken,
  GetApolloClientCacheToken,
  ApolloRenderEnhancer,
} from 'fusion-plugin-apollo';
import GraphQLDevPlugin, {GraphQLDevToken} from '@uber/graphql-scripts';
import GraphQLMetricsPlugin from '@uber/fusion-plugin-graphql-metrics';
import {
  defaultDataIdFromObject,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import registerPlugins from '../__generated__/register-plugins';
import registerGraphQLPlugins from '../__generated__/register-graphql-plugins';
import registerGraphQLLinks from '../__generated__/register-graphql-links';

import GraphQLSchemaPlugin from '../graphql';

import introspectionQueryResultData from '../../.graphql/fragment-types.json';

export default function initGraphQL(app: FusionApp) {
  app.enhance(RenderToken, ApolloRenderEnhancer);
  app.register(ApolloClientToken, ApolloClientPlugin);
  app.register(
    GetApolloClientCacheToken,
    ctx =>
      new InMemoryCache({
        addTypename: ctx.method !== 'POST',
        dataIdFromObject: object =>
          object.uuid
            ? `${object.__typename}:${object.uuid}`
            : defaultDataIdFromObject(object),
        fragmentMatcher: new IntrospectionFragmentMatcher({
          introspectionQueryResultData,
        }),
      })
  );

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
