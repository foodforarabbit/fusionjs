// @flow
import {createPlugin, createToken} from 'fusion-core';

type DepsType = {};

export const CustomGraphQLLinksToken = createToken<any>('CustomGraphQLLinks');

export default createPlugin<DepsType, any>({
  deps: {
    // Add custom graphql link plugins here, and register it in src/uber/graphql.js:
  },
  provides: deps => {
    return Object.keys(deps).map(dep => deps[dep]);
  },
});
