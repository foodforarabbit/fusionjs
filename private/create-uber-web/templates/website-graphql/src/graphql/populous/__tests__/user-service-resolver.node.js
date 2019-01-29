// @flow
import {GraphQLSchemaToken} from 'fusion-apollo';
import gql from 'graphql-tag';
import {UserServiceToken} from '../../../gen/infra/populous/user-service-plugin.js';
import UserServiceResolverPlugin from '../user-service-resolver.js';
import gqlTest from '../../../test-utils/graphql-test'; // TODO: implement this test

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
      #TODO write query here
    `,
  }); // TODO: write real assertions

  expect(result).toBeTruthy();
});
