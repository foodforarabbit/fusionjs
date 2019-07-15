// @flow
import type FusionApp from 'fusion-core';
import {
  ApolloClientToken,
  GraphQLSchemaToken,
  ApolloClientPlugin,
  GetApolloClientLinksToken,
} from 'fusion-plugin-apollo';
import GraphQLDevPlugin, {GraphQLDevToken} from '@uber/graphql-scripts';
import registerGraphQLPlugins from '../graphql/__generated__/register-graphql-plugins';
import {createPlugin} from 'fusion-core';
import {mergeSchemas} from 'graphql-tools';

import GraphQLMetricsPlugin from '@uber/fusion-plugin-graphql-metrics';
import SharedGraphQLPlugins, {
  SharedGraphQLPluginsToken,
} from '../graphql/__generated__/shared-plugins';
import SharedGraphQLLinks, {
  SharedGraphQLLinksToken,
} from '../graphql/__generated__/shared-links';

import CustomGraphQLPlugins, {
  CustomGraphQLPluginsToken,
} from '../graphql/custom-plugins';
import CustomGraphQLLinks, {
  CustomGraphQLLinksToken,
} from '../graphql/custom-links';
import CatServiceSchema, {
  CatServiceSchemaToken,
} from '../graphql/cats/cat-service-resolver';

export default function initGraphQL(app: FusionApp) {
  app.register(ApolloClientToken, ApolloClientPlugin);
  if (__NODE__) {
    const GraphQLSchemaPlugin = createPlugin<any, any>({
      deps: {
        sharedPlugins: SharedGraphQLPluginsToken,
        sharedLinks: SharedGraphQLLinksToken,
        customPlugins: CustomGraphQLPluginsToken,
        customLinks: CustomGraphQLLinksToken,
      },
      provides: ({sharedPlugins, customPlugins, sharedLinks, customLinks}) => {
        const plugins = [...sharedPlugins, ...customPlugins];
        const linkSchemas = [...sharedLinks, ...customLinks].map(l => l.schema);
        const linkResolvers = [...sharedLinks, ...customLinks]
          .map(l => l.resolvers)
          .reduce((acc, curr) => ({...acc, ...curr}), {});
        return mergeSchemas({
          schemas: [...plugins, ...linkSchemas],
          resolvers: {
            ...linkResolvers,
          },
        });
      },
    });
    // $FlowFixMe
    app.middleware(require('koa-bodyparser')());
    app.register(GetApolloClientLinksToken, GraphQLMetricsPlugin);
    app.register(GraphQLSchemaToken, GraphQLSchemaPlugin);
    app.register(GraphQLDevToken, GraphQLDevPlugin);
    app.register(SharedGraphQLPluginsToken, SharedGraphQLPlugins);
    app.register(SharedGraphQLLinksToken, SharedGraphQLLinks);
    app.register(CustomGraphQLLinksToken, CustomGraphQLLinks);
    app.register(CustomGraphQLPluginsToken, CustomGraphQLPlugins);
    registerGraphQLPlugins(app);

    // register custom graphql plugins here:
    app.register(CatServiceSchemaToken, CatServiceSchema);
  }
}
