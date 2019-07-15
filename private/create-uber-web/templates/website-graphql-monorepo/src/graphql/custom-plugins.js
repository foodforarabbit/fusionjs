// @flow
import {createPlugin, createToken} from 'fusion-core';
import {CatServiceSchemaToken} from './cats/cat-service-resolver';

export const CustomGraphQLPluginsToken = createToken<any>(
  'CustomGraphQLPlugins'
);

export default createPlugin<any, any>({
  deps: {
    // Add custom graphql plugins here, and register it in src/uber/graphql.js:
    CatServiceSchema: CatServiceSchemaToken,
  },
  provides: deps => {
    return Object.keys(deps).map(dep => deps[dep]);
  },
});
