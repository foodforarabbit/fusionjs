// @flow
import gql from 'graphql-tag';
import {UserServiceToken} from '@uber/graphql-plugin-populous';
import gqlTest from '../../test-utils/graphql-test';
import {AuthHeadersUUIDConfigToken} from '@uber/fusion-plugin-auth-headers';

const GET_USER = gql`
  query GetUser {
    user {
      id
      firstName
      lastName
      nickname
    }
  }
`;

test('UserService resolver - user query', async () => {
  const client = gqlTest(app => {
    app.register(AuthHeadersUUIDConfigToken, 'abcd');
    // $FlowFixMe
    app.register(UserServiceToken, {
      getUser: jest.fn(args => {
        expect(args).toMatchInlineSnapshot(`
          Object {
            "userUuid": "abcd",
          }
        `);
        return Promise.resolve({
          uuid: args.userUuid,
          firstName: 'first',
          lastName: 'last',
          nickname: 'nickname',
        });
      }),
      getUserTags: jest.fn(args => {
        expect(args).toMatchInlineSnapshot();
        return Promise.resolve({
          'tag-1': {
            name: 'tag-1',
          },
          'tag-2': {
            name: 'tag-2',
          },
        });
      }),
    });
  });
  const result = await client.query({
    query: GET_USER,
  });

  expect(result.errors).toBeFalsy();
  expect(result.data).toMatchInlineSnapshot(`
    Object {
      "user": Object {
        "__typename": "User",
        "firstName": null,
        "id": "abcd",
        "lastName": null,
        "nickname": "nickname",
      },
    }
  `);
});
