// @flow
import type FusionApp from 'fusion-core';
import {ApolloClientToken, GraphQLSchemaToken} from 'fusion-apollo';
import ApolloServer from 'fusion-plugin-apollo-server';
import ApolloClient from 'fusion-apollo-universal-client';
import GraphQLDevPlugin, {GraphQLDevToken} from '@uber/graphql-scripts';
import registerPlugins from '../gen/register-plugins';
import registerGraphQLPlugins from '../gen/register-graphql-plugins';
import registerGraphQLLinks from '../gen/register-graphql-links';

import GraphQLSchemaPlugin from '../graphql/index.js';

export default function initGraphQL(app: FusionApp) {
  app.register(ApolloClientToken, ApolloClient);
  if (__NODE__) {
    // $FlowFixMe
    app.middleware(require('koa-bodyparser')());
    app.register(ApolloServer);
    app.register(GraphQLSchemaToken, GraphQLSchemaPlugin);
    app.register(GraphQLDevToken, GraphQLDevPlugin);
    registerPlugins(app);
    registerGraphQLPlugins(app);
    registerGraphQLLinks(app);
  }
}
