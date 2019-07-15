// @flow
import React from 'react';
import {Query} from 'react-apollo';
import {gql} from 'fusion-plugin-apollo';

// Load the graphql query using the gql macro
const GET_USER = gql('./get-user-query.graphql');

export default function UserContainer() {
  return (
    <Query query={GET_USER}>
      {getUserResult => {
        const {data, loading, error} = getUserResult;
        if (data && data.user) {
          return (
            <div>
              <div>
                Hello {data.user.firstName} {data.user.lastName}
              </div>
              <div>Test</div>
              <div>Your nickname is {data.user.nickname}</div>
            </div>
          );
        }
        if (loading) {
          return <div>Loading...</div>;
        }
        return <div>Error loading user: {error ? error.message : ''}</div>;
      }}
    </Query>
  );
}
