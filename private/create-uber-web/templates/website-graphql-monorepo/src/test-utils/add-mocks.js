// @flow
import type FusionApp from 'fusion-core';
import {GraphQLDevToken} from '@uber/graphql-scripts';
import {createPlugin} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

export default function addMocks(app: FusionApp) {
  const mockAtreyuFn = () => ({
    resolve: () => {
      throw new Error(
        'Cant resolve atreyu requests in testing. Use mocks instead'
      );
    },
  });
  app.register(GraphQLDevToken, createPlugin<*, *>({}));
  app.register(AtreyuToken, {
    createGraph: mockAtreyuFn,
    createAsyncGraph: mockAtreyuFn,
    createAsyncRequest: mockAtreyuFn,
    createRequest: mockAtreyuFn,
  });
}
