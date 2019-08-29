// @flow
import type FusionApp from 'fusion-core';
import {ApolloClientToken} from 'fusion-plugin-apollo';
import React from 'react';
import {getSimulator, createRequestContext} from 'fusion-test-utils';
import initGraphQL from '../uber/graphql';
import initSecurity from '../uber/security';
import initLogging from '../uber/logging';
import initDataFetching from '../uber/data-fetching';
import addMocks from './add-mocks';

import App from 'fusion-react';

export default function graphqlTest(enhanceApp: (app: FusionApp) => any) {
  const app = new App(<div />);
  // initialize plugins
  initGraphQL(app);
  initDataFetching(app);
  initSecurity(app);
  initLogging(app);
  enhanceApp(app);

  // mocks
  addMocks(app);
  const sim = getSimulator(app);
  const ctx = createRequestContext('/graphql', {});
  const client = sim.getService(ApolloClientToken)(ctx, {});
  return client;
}
