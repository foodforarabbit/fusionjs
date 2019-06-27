// @flow
import React from 'react';
import {getSimulator, createRequestContext} from 'fusion-test-utils';
import Plugin from '../index.js';
import {RenderToken} from 'fusion-core';
import App from 'fusion-react';
import {
  ApolloRenderEnhancer,
  ApolloClientToken,
  GraphQLSchemaToken,
  ApolloClientPlugin,
  GetApolloClientLinksToken,
} from 'fusion-plugin-apollo';
import {LoggerToken, FetchToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import gql from 'graphql-tag';
import {makeExecutableSchema} from 'graphql-tools';

function getMockLogger(): any {
  return {
    error: jest.fn(),
  };
}

function getMockM3(): any {
  return {
    timing: jest.fn(),
  };
}

function getMockTracer(): any {
  return {};
}

function testApp({typeDefs, resolvers}) {
  const logger = getMockLogger();
  const m3 = getMockM3();
  const tracer = getMockTracer();
  const app = new App(<div />);
  app.enhance(RenderToken, ApolloRenderEnhancer);
  app.register(
    GraphQLSchemaToken,
    makeExecutableSchema({
      typeDefs,
      resolvers,
    })
  );
  app.register(LoggerToken, logger);
  app.register(M3Token, m3);
  app.register(TracerToken, tracer);
  app.register(GetApolloClientLinksToken, Plugin);
  app.register(ApolloClientToken, ApolloClientPlugin);
  // $FlowFixMe
  app.register(FetchToken, () => {});
  const sim = getSimulator(app);
  const ctx = createRequestContext('/graphql');
  const getClient = sim.getService(ApolloClientToken);
  const client = getClient(ctx, {});
  return {app, client, logger, m3, tracer};
}

test('GraphQL Middleware', async () => {
  const typeDefs = `
  type Query {
    user: User
  }
  type User {
    id: ID
    firstName: String
    lastName: String
  }
  `;
  const resolvers = {
    Query: {
      user: async (parent, args, ctx, info) => {
        return {
          id: '123',
          firstName: 'Hello',
          lastName: 'World',
        };
      },
    },
  };
  const {client, m3} = testApp({typeDefs, resolvers});
  const result = await client.query({
    query: gql`
      query GetUser {
        user {
          id
          firstName
          lastName
        }
      }
    `,
  });
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(typeof m3.timing.mock.calls[0][1]).toEqual('number');
  expect(m3.timing.mock.calls[0][2]).toMatchInlineSnapshot(`
    Object {
      "operation_name": "get_user",
      "operation_type": "query",
      "result": "success",
    }
  `);
  expect(result.data.user).toEqual({
    __typename: 'User',
    firstName: 'Hello',
    id: '123',
    lastName: 'World',
  });
});

test('GraphQL Middleware - Query with an error', async () => {
  const typeDefs = `
  type Query {
    user: User
  }
  type User {
    id: ID
    firstName: String
    lastName: String
  }
  `;
  const resolvers = {
    Query: {
      user: async (parent, args, ctx, info) => {
        throw new Error('Fails query');
      },
    },
  };
  const {client, logger, m3} = testApp({typeDefs, resolvers});
  await expect(
    client.query({
      query: gql`
        query GetUser {
          user {
            id
            firstName
            lastName
          }
        }
      `,
    })
  ).rejects.toMatchInlineSnapshot(`[Error: GraphQL error: Fails query]`);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(typeof m3.timing.mock.calls[0][1]).toEqual('number');
  expect(m3.timing.mock.calls[0][2]).toMatchInlineSnapshot(`
    Object {
      "operation_name": "get_user",
      "operation_type": "query",
      "result": "failure",
    }
  `);
  expect(logger.error.mock.calls.length).toEqual(1);
  expect(logger.error.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "GetUser query failed",
      [GraphQLError: Fails query],
    ]
  `);
});

test('GraphQL Middleware - Mutation with an error', async () => {
  const typeDefs = `
  type Query {
    user: User
  }
  type Mutation {
    updateUser(arg: String): User
  }
  type User {
    id: ID
    firstName: String
    lastName: String
  }
  `;
  const resolvers = {
    Query: {
      user: () => {},
    },
    Mutation: {
      updateUser: async (parent, args, ctx, info) => {
        expect(args.arg).toEqual('test');
        throw new Error('Fails query');
      },
    },
  };
  const {client, logger, m3} = testApp({typeDefs, resolvers});
  await expect(
    client.mutate({
      mutation: gql`
        mutation UpdateUser($arg: String) {
          updateUser(arg: $arg) {
            id
            firstName
            lastName
          }
        }
      `,
      variables: {
        arg: 'test',
      },
    })
  ).rejects.toMatchInlineSnapshot(`[Error: GraphQL error: Fails query]`);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(typeof m3.timing.mock.calls[0][1]).toEqual('number');
  expect(m3.timing.mock.calls[0][2]).toMatchInlineSnapshot(`
    Object {
      "operation_name": "update_user",
      "operation_type": "mutation",
      "result": "failure",
    }
  `);
  expect(logger.error.mock.calls.length).toEqual(1);
  expect(logger.error.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "UpdateUser mutation failed",
      [GraphQLError: Fails query],
    ]
  `);
});
