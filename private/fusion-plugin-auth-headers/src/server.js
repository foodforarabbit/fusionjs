// @flow
/* eslint-env node */

import assert from 'assert';

import {createPlugin, memoize} from 'fusion-core';
import type {Context, FusionPlugin} from 'fusion-core';

import {
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken,
} from './tokens';

declare var __DEV__: boolean;

const authHeaderPrefix = 'x-auth-params-';

const breezeHeaderMapping: {[header: string]: string} = {
  uuid: 'x-auth-params-user-uuid',
  token: 'x-uber-breeze-rtapi-token',
};

type AuthHeadersConfig = {
  uuid: string,
  email: string,
  token: string,
  roles: string,
  groups: string,
};
type AuthHeaderKey = $Keys<AuthHeadersConfig>;

class AuthHeaders {
  ctx: Context;
  devOverrideConfig: AuthHeadersConfig | {||};

  constructor(ctx: Context, devOverrideConfig: AuthHeadersConfig) {
    assert(ctx, `AuthHeaders requires a ctx object`);
    this.ctx = ctx;
    this.devOverrideConfig =
      (__DEV__ && devOverrideConfig) || Object.freeze({});
  }

  get(key: AuthHeaderKey): string {
    let xAuthValue =
      this.ctx.request.headers[breezeHeaderMapping[key]] ||
      this.ctx.request.headers[`${authHeaderPrefix}${key}`] ||
      // $FlowFixMe
      this.devOverrideConfig[key] ||
      /**
       * should return a string not `undefined` in the default case per the docs
       * https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-auth-headers
       */
      '';

    return xAuthValue;
  }
}

const deps = {
  uuid: AuthHeadersUUIDConfigToken.optional,
  email: AuthHeadersEmailConfigToken.optional,
  token: AuthHeadersTokenConfigToken.optional,
  roles: AuthHeadersRolesConfigToken.optional,
  groups: AuthHeadersGroupsConfigToken.optional,
};

export type AuthHeadersService = {from: (ctx: Context) => AuthHeaders};
type AuthHeadersPluginType = FusionPlugin<*, AuthHeadersService>;
const plugin: AuthHeadersPluginType =
  // $FlowFixMe
  __NODE__ &&
  createPlugin({
    deps,
    provides: deps => {
      const service: AuthHeadersService = {
        from: memoize((ctx: Context) => {
          return new AuthHeaders(ctx, {
            uuid: deps.uuid || '',
            email: deps.email || '',
            token: deps.token || '',
            roles: deps.roles || '',
            groups: deps.groups || '',
          });
        }),
      };
      return service;
    },
  });

export default plugin;
