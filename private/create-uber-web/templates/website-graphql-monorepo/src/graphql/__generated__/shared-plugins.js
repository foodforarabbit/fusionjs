// @flow
import {createPlugin, createToken} from 'fusion-core';
import {UserServiceSchemaToken} from '@uber/graphql-plugin-populous';
import {TripServiceSchemaToken} from '@uber/graphql-plugin-trident';

type DepsType = {
  UserServiceSchema: typeof UserServiceSchemaToken,
  TripServiceSchema: typeof TripServiceSchemaToken,
};

export const SharedGraphQLPluginsToken = createToken<any>(
  'SharedGraphQLPlugins'
);

export default createPlugin<DepsType, any>({
  deps: {
    UserServiceSchema: UserServiceSchemaToken,
    TripServiceSchema: TripServiceSchemaToken,
  },
  provides: deps => {
    return Object.keys(deps).map(dep => deps[dep]);
  },
});
