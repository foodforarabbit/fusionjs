// @flow
import {writeFile, readFile, removeFile} from '@dubstep/core';
import {codemodFusionApollo} from './codemod-fusion-apollo';

jest.mock('../../utils/get-latest-version.js', () => {
  return {
    getLatestVersion() {
      return '^2.0.0';
    },
  };
});

test('fusion apollo codemod', async () => {
  const root = 'fixtures/fusion-apollo';
  const pkg = `${root}/package.json`;
  const main = `${root}/src/main.js`;
  await writeFile(
    pkg,
    JSON.stringify({
      dependencies: {
        'fusion-apollo': '1',
        'fusion-plugin-apollo-server': '1',
        'fusion-apollo-universal-client': '1',
      },
    })
  );
  await writeFile(
    main,
    `
import React from 'react';
import App, {gql} from 'fusion-apollo';
import ApolloServer, {ApolloServerEndpointToken} from 'fusion-plugin-apollo-server';
import {ApolloClientEndpointToken} from 'fusion-apollo-universal-client';

const app = new App(<div />);
app.register(ApolloServer);
app.register(ApolloClientEndpointToken, '/test');
app.register(ApolloServerEndpointToken, '/test');
`
  );
  await codemodFusionApollo({dir: root, strategy: 'latest'});
  const newPkg = await readFile(pkg);
  const newMain = await readFile(main);
  await removeFile(root);
  await removeFile(main);
  expect(newPkg).toMatchInlineSnapshot(`
    "{
      \\"dependencies\\": {
        \\"fusion-plugin-apollo\\": \\"^2.0.0\\",
        \\"@uber/graphql-scripts\\": \\"^2.0.0\\",
        \\"@uber/fusion-plugin-graphql-logging-middleware\\": \\"^2.0.0\\"
      }
    }"
  `);
  expect(newMain).toMatchInlineSnapshot(`
    "
    import React from 'react';
    import { gql, GraphQLEndpointToken, ApolloRenderEnhancer, GraphQLSchemaToken } from \\"fusion-plugin-apollo\\";
    import App from 'fusion-react';
    import {RenderToken} from 'fusion-core';
    import GraphQLLoggingMiddleware from '@uber/fusion-plugin-graphql-logging-middleware';
    app.enhance(RenderToken, ApolloRenderEnhancer);
    
    const app = new App(<div />);
    app.enhance(GraphQLSchemaToken, GraphQLLoggingMiddleware);
    app.register(GraphQLEndpointToken, '/test');
    "
  `);
});
