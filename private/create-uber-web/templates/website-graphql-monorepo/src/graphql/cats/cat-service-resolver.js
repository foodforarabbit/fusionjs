// @flow strict-local
// flowlint unclear-type:off
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {createPlugin, createToken} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import type {Context} from 'fusion-core';
import type {GraphQLResolveInfo} from 'graphql';

const typeDefs = gql('./cat-service-schema.graphql');
export const CatServiceSchemaToken = createToken<any>('CatServiceSchema');
type DepsType = {
  logger: typeof LoggerToken,
};
export default createPlugin<DepsType, any>({
  deps: {
    logger: LoggerToken,
  },
  provides: ({logger}) => {
    // Implement resolvers here
    const resolvers = {
      Query: {
        cat(parent: void, args: {}, ctx: Context, info: GraphQLResolveInfo) {
          return getRandomCat();
        },
      },
    };
    return makeExecutableSchema({
      typeDefs,
      resolvers,
    });
  },
});

function getRandomCat() {
  const cats = [
    {id: 1, name: 'Simba', age: 10},
    {id: 2, name: 'Tigger', age: 11},
    {id: 3, name: 'Garfield', age: 12},
  ];
  return rand(cats);
}

function rand(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}
