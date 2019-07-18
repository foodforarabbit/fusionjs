// @flow
import {migrateGraphQLMetrics} from './codemod';
import {writeFile, readFile, removeFile} from '@dubstep/core';

test('GraphQLMetricsPlugin codemod', async () => {
  const contents = `
 // @flow
import type FusionApp from 'fusion-core';
import { ApolloClientToken, GraphQLSchemaToken, ApolloClientPlugin } from 'fusion-plugin-apollo';
import GraphQLLoggingMiddleware from '@uber/fusion-plugin-graphql-logging-middleware';

import GraphQLSchemaPlugin from '../graphql/index';

export default function initGraphQL(app: FusionApp) {
  app.register(ApolloClientToken, ApolloClientPlugin);
  if (__NODE__) {
    app.enhance(GraphQLSchemaToken, GraphQLLoggingMiddleware);
    app.register(GraphQLSchemaToken, GraphQLSchemaPlugin);
  }
}
  `;
  const root = 'fixtures/graphql-metrics-codemod';
  const fixture = `${root}/fixture.js`;
  await writeFile(fixture, contents);
  await migrateGraphQLMetrics({dir: root, strategy: 'latest'});
  const newContents = await readFile(fixture);
  expect(newContents).toMatchInlineSnapshot(`
    "
     // @flow
    import type FusionApp from 'fusion-core';
    import {
      ApolloClientToken,
      GraphQLSchemaToken,
      ApolloClientPlugin,
      GetApolloClientLinksToken,
    } from 'fusion-plugin-apollo';
    import GraphQLSchemaPlugin from '../graphql/index';

    import GraphQLMetricsPlugin from '@uber/fusion-plugin-graphql-metrics';

    export default function initGraphQL(app: FusionApp) {
      app.register(ApolloClientToken, ApolloClientPlugin);
      if (__NODE__) {
        app.register(GetApolloClientLinksToken, GraphQLMetricsPlugin);
        app.register(GraphQLSchemaToken, GraphQLSchemaPlugin);
      }
    }
      "
  `);
  await removeFile(root);
});
