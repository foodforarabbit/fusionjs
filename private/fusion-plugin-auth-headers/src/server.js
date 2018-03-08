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

class MissingXAuthParamError extends Error {
  constructor(url: string, param: AuthHeaderKey) {
    const message =
      `Unable to resolve the ${authHeaderPrefix}${param} HTTP header for the ` +
      `incoming request to ${url || 'unknown path'}. `;

    const devMessage =
      'Please either provide an override with "AuthHeaders*ConfigToken" for this parameter' +
      'or ensure that it is being injected into request headers.';

    super(message + (__DEV__ ? devMessage : ''));

    this.name = 'MissingXAuthParamError';
  }
}

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
    assert(ctx, `AuthHeaders requires a ctx object: ${ctx}`);
    this.ctx = ctx;
    this.devOverrideConfig =
      (__DEV__ && devOverrideConfig) || Object.freeze({});
  }

  get(key: AuthHeaderKey): string {
    let xAuthValue =
      //$FlowFixMe
      this.devOverrideConfig[key] ||
      this.ctx.request.headers[`${authHeaderPrefix}${key}`];

    if (!xAuthValue) {
      throw new MissingXAuthParamError(this.ctx.request.url, key);
    }
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
