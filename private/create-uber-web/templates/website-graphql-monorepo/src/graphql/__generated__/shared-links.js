// @flow
import {createPlugin, createToken} from 'fusion-core';
import {UserServiceLinkTripServiceToken} from '@uber/graphql-plugin-populous-link-trident';

type DepsType = {
  UserServiceLinkTripService: typeof UserServiceLinkTripServiceToken,
};

export const SharedGraphQLLinksToken = createToken<any>('SharedGraphQLLinks');

export default createPlugin<DepsType, any>({
  deps: {
    UserServiceLinkTripService: UserServiceLinkTripServiceToken,
  },
  provides: deps => {
    return Object.keys(deps).map(dep => deps[dep]);
  },
});
