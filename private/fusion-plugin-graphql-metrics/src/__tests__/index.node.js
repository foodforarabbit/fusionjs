// @flow
import React from 'react';
import {getSimulator, createRequestContext} from 'fusion-test-utils';
import Plugin from '../index.js';
import {RenderToken, type Context} from 'fusion-core';
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
import {makeExecutableSchema, mergeSchemas} from 'graphql-tools';

function getMockLogger(): any {
  return {
    error: jest.fn(),
    warn: jest.fn(),
  };
}

function getMockM3(): any {
  return {
    timing: jest.fn(),
  };
}

function getMockTracer(): any {
  const mockSpan = {
    context: jest.fn(() => 'root'),
    finish: jest.fn(),
    setTag: jest.fn(),
  };
  const spans = [];
  const tracer = {
    startSpan: jest.fn(() => {
      const span = {
        context: jest.fn(() => 'test'),
        finish: jest.fn(),
        setTag: jest.fn(),
      };
      spans.push(span);
      return span;
    }),
    get spans() {
      return spans;
    },
  };
  return {
    from(ctx: Context) {
      return {
        span: mockSpan,
        tracer,
      };
    },
    tracer,
  };
}

function testApp(schema) {
  const logger = getMockLogger();
  const m3 = getMockM3();
  const tracer = getMockTracer();
  const app = new App(<div />);
  app.enhance(RenderToken, ApolloRenderEnhancer);
  app.register(GraphQLSchemaToken, schema);
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

test('GraphQL Metrics', async () => {
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
  let resolverCount = 0;
  const resolvers = {
    Query: {
      user: async (parent, args, ctx, info) => {
        resolverCount++;
        return {
          id: '123',
          firstName: 'Hello',
          lastName: 'World',
        };
      },
    },
  };
  const {client, m3, tracer} = testApp(
    makeExecutableSchema({typeDefs, resolvers})
  );
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
  expect(tracer.tracer.spans.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls[0][0]).toEqual(
    'graphql.query.GetUser'
  );
  expect(tracer.tracer.startSpan.mock.calls[0][1]).toMatchInlineSnapshot(`
            Object {
              "childOf": "root",
              "tags": Object {
                "component": "graphql",
                "operationType": "query",
              },
            }
      `);
  expect(resolverCount).toEqual(1);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(m3.timing.mock.calls[0][1]).toBeInstanceOf(Date);
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

test('GraphQL Metrics - Multiple Queries', async () => {
  const typeDefs = `
  type Query {
    user(arg: String): User
  }
  type User {
    id: ID
    firstName: String
    lastName: String
  }
  `;
  let resolverCount = 0;
  const spans = {};
  const resolvers = {
    Query: {
      user: async (parent, args, ctx, info) => {
        spans[args.arg] = ctx._getSpanContextFromInfo(info);
        resolverCount++;
        return {
          id: args.arg,
          firstName: 'Hello',
          lastName: 'World',
        };
      },
    },
    User: {
      id: (parent, args, ctx, info) => {
        expect(ctx._getSpanContextFromInfo(info)).toEqual(spans[parent.id]);
        return parent.id;
      },
    },
  };
  const {client, m3, tracer} = testApp(
    makeExecutableSchema({typeDefs, resolvers})
  );
  const query = gql`
    query GetUser($arg: String) {
      user(arg: $arg) {
        id
        firstName
        lastName
      }
    }
  `;
  const result = await client.query({query, variables: {arg: 'test'}});
  const result2 = await client.query({query, variables: {arg: 'other'}});

  expect(tracer.tracer.spans.length).toEqual(2);
  expect(tracer.tracer.startSpan.mock.calls.length).toEqual(2);
  expect(tracer.tracer.spans[0]).not.toEqual(tracer.tracer.spans[1]);
  expect(tracer.tracer.startSpan.mock.calls[0][0]).toEqual(
    'graphql.query.GetUser'
  );
  expect(tracer.tracer.startSpan.mock.calls[1][0]).toEqual(
    'graphql.query.GetUser'
  );
  expect(tracer.tracer.startSpan.mock.calls[0][1]).toMatchInlineSnapshot(`
            Object {
              "childOf": "root",
              "tags": Object {
                "component": "graphql",
                "operationType": "query",
              },
            }
      `);
  expect(resolverCount).toEqual(2);
  expect(m3.timing.mock.calls.length).toEqual(2);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(m3.timing.mock.calls[0][1]).toBeInstanceOf(Date);
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
    id: 'test',
    lastName: 'World',
  });

  expect(result2.data.user).toEqual({
    __typename: 'User',
    firstName: 'Hello',
    id: 'other',
    lastName: 'World',
  });
});

test('GraphQL Metrics - Query with an error', async () => {
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
  const {client, logger, m3, tracer} = testApp(
    makeExecutableSchema({typeDefs, resolvers})
  );
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

  expect(tracer.tracer.spans.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls[0][0]).toEqual(
    'graphql.query.GetUser'
  );
  expect(tracer.tracer.startSpan.mock.calls[0][1]).toMatchInlineSnapshot(`
        Object {
          "childOf": "root",
          "tags": Object {
            "component": "graphql",
            "operationType": "query",
          },
        }
    `);
  expect(tracer.tracer.spans[0].setTag.mock.calls[0]).toEqual(['error', true]);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(m3.timing.mock.calls[0][1]).toBeInstanceOf(Date);
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

test('GraphQL Metrics with Stitched Schema - Query with an error', async () => {
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

  const nextTypeDefs = `
  type Query {
    test: String
  } 
  `;
  const resolvers = {
    Query: {
      user: async (parent, args, ctx, info) => {
        throw new Error('Fails query');
      },
    },
  };
  const nextResolvers = {
    Query: {
      test() {
        throw new Error('Fails query');
      },
    },
  };
  const {client, logger, m3, tracer} = testApp(
    mergeSchemas({
      schemas: [
        makeExecutableSchema({typeDefs, resolvers}),
        makeExecutableSchema({
          typeDefs: nextTypeDefs,
          resolvers: nextResolvers,
        }),
      ],
    })
  );
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

  expect(tracer.tracer.spans.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls[0][0]).toEqual(
    'graphql.query.GetUser'
  );
  expect(tracer.tracer.startSpan.mock.calls[0][1]).toMatchInlineSnapshot(`
        Object {
          "childOf": "root",
          "tags": Object {
            "component": "graphql",
            "operationType": "query",
          },
        }
    `);
  expect(tracer.tracer.spans[0].setTag.mock.calls[0]).toEqual(['error', true]);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(m3.timing.mock.calls[0][1]).toBeInstanceOf(Date);
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

test('GraphQL Metrics - Mutation with an error', async () => {
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
  const {client, logger, m3, tracer} = testApp(
    makeExecutableSchema({typeDefs, resolvers})
  );
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
  expect(tracer.tracer.spans.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls.length).toEqual(1);
  expect(tracer.tracer.startSpan.mock.calls[0][0]).toEqual(
    'graphql.mutation.UpdateUser'
  );
  expect(tracer.tracer.startSpan.mock.calls[0][1]).toMatchInlineSnapshot(`
    Object {
      "childOf": "root",
      "tags": Object {
        "component": "graphql",
        "operationType": "mutation",
      },
    }
  `);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls.length).toEqual(1);
  expect(m3.timing.mock.calls[0][0]).toEqual('graphql_operation');
  expect(m3.timing.mock.calls[0][1]).toBeInstanceOf(Date);
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

test('GraphQL Metrics - missing tracer', async () => {
  const logger = getMockLogger();
  const m3 = getMockM3();
  const app = new App(<div />);
  const typeDefs = `
  type Query  {
    test: String
  }
  `;
  const resolvers = {
    Query: {
      test() {},
    },
  };
  app.enhance(RenderToken, ApolloRenderEnhancer);
  app.register(GraphQLSchemaToken, makeExecutableSchema({typeDefs, resolvers}));
  app.register(LoggerToken, logger);
  app.register(M3Token, m3);
  app.register(GetApolloClientLinksToken, Plugin);
  app.register(ApolloClientToken, ApolloClientPlugin);
  // $FlowFixMe
  app.register(FetchToken, () => {});
  app.register(LoggerToken, logger);
  app.register(GetApolloClientLinksToken, Plugin);
  app.middleware(async (ctx, next) => {
    await next();
    expect(ctx._getSpanContextFromInfo).toThrow(
      'This feature requires the Tracer to be enabled.'
    );
  });
  const sim = getSimulator(app);
  await sim.render('/');
});

test('GraphQL Metrics - anonymous operation', async () => {
  const typeDefs = `
  type Query  {
    test: String
  }
  `;
  const resolvers = {
    Query: {
      test() {
        return 'test';
      },
    },
  };
  const {client, logger} = testApp(makeExecutableSchema({typeDefs, resolvers}));
  const result = await client.query({
    query: gql`
      {
        test
      }
    `,
  });
  expect(result.data).toEqual({test: 'test'});
  expect(logger.warn.mock.calls.length).toEqual(1);
});
