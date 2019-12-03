// @flow
import {GraphQLSchemaToken} from 'fusion-plugin-apollo';
import gql from 'graphql-tag';
import {UserServiceToken} from '../../../__generated__/infra/populous/user-service-plugin.js';
import UserServiceResolverPlugin from '../user-service-resolver.js';
import gqlTest from '../../../test-utils/graphql-test'; // TODO: implement this test

// eslint-disable-next-line jest/no-disabled-tests
test.skip('UserService resolver', async () => {
  const client = gqlTest(app => {
    // $FlowFixMe
    app.register(UserServiceToken, {
      // TODO: implement test mock here
      exampleMockFn: jest.fn(() => {
        return Promise.resolve({
          mockData: true,
        });
      }),
    });
    app.register(GraphQLSchemaToken, UserServiceResolverPlugin);
  });
  const result = await client.query({
    query: gql`
      query TestQuery {
        dummy
      }
    `,
  }); // TODO: write real assertions

  expect(result).toBeTruthy();
});
