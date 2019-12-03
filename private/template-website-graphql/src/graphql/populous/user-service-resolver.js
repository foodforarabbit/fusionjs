// @flow
import {makeExecutableSchema} from 'graphql-tools';
import {gql} from 'fusion-plugin-apollo';
import {createPlugin, createToken} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {UserServiceToken} from '../../__generated__/infra/populous/user-service-plugin.js';

const typeDefs = gql('./user-service-schema.graphql');
export const UserServiceSchemaToken = createToken<any>('UserServiceSchema');
type DepsType = {
  logger: typeof LoggerToken,
  UserService: typeof UserServiceToken,
};
export default createPlugin<DepsType, any>({
  deps: {
    logger: LoggerToken,
    UserService: UserServiceToken,
  },
  provides: ({logger, UserService}) => {
    // Implement resolvers here
    const resolvers = {
      Query: {
        dummy: () => '',
      },
    };
    return makeExecutableSchema({
      typeDefs,
      resolvers,
    });
  },
});
