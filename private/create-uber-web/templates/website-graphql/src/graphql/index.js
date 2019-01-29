// @flow
import {createPlugin} from 'fusion-core';
import {mergeSchemas} from 'graphql-tools';
import {UserServiceSchemaToken} from './populous/user-service-resolver';

type DepsType = {
  UserServiceSchema: typeof UserServiceSchemaToken,
};

export default createPlugin<DepsType, any>({
  deps: {
    UserServiceSchema: UserServiceSchemaToken,
  },
  provides: deps => {
    return mergeSchemas({
      schemas: [deps.UserServiceSchema],
      resolvers: {},
    });
  },
});
