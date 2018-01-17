// @flow
/* eslint-env node */

import assert from 'assert';

import {createOptionalToken} from 'fusion-tokens';
import {withDependencies, memoize} from 'fusion-core';
import type {Context, FusionPlugin} from 'fusion-core';

declare var __DEV__: boolean;

export const AuthHeadersUUIDConfigToken: ?string = createOptionalToken(
  'AuthHeadersUUIDConfigToken',
  null
);
export const AuthHeadersEmailConfigToken: ?string = createOptionalToken(
  'AuthHeadersUUIDConfigToken',
  null
);
export const AuthHeadersTokenConfigToken: ?string = createOptionalToken(
  'AuthHeadersTokenConfigToken',
  null
);
export const AuthHeadersRolesConfigToken: ?string = createOptionalToken(
  'AuthHeadersRolesConfigToken',
  null
);
export const AuthHeadersGroupsConfigToken: ?string = createOptionalToken(
  'AuthHeadersGroupsConfig',
  {}
);

const authHeaderPrefix = 'x-auth-params-';

class MissingXAuthParamError extends Error {
  constructor(url: string, param: AuthHeaderKey) {
    const message =
      `Unable to resolve the ${authHeaderPrefix}${param} parameter for the ` +
      `incoming request to ${url || 'unknown path'}. ` +
      'Please either provide an override for this parameter or ensure that it is ' +
      'being injected into request headers.';
    super(message);

    this.name = 'MissingXAuthParamError';
  }
}

type AuthHeadersConfig = {
  uuid: ?string,
  email: ?string,
  token: ?string,
  roles: ?string,
  groups: ?string,
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

type SessionService = {from: (ctx: Context) => AuthHeaders};
type SessionPluginType = FusionPlugin<*, SessionService>;
const plugin: SessionPluginType = withDependencies({
  uuid: AuthHeadersUUIDConfigToken,
  email: AuthHeadersEmailConfigToken,
  token: AuthHeadersTokenConfigToken,
  roles: AuthHeadersRolesConfigToken,
  groups: AuthHeadersGroupsConfigToken,
})(deps => {
  // const {authHeadersConfig} = deps;
  const service: SessionService = {
    from: memoize((ctx: Context) => {
      return new AuthHeaders(ctx, deps);
    }),
  };
  return service;
});

export default plugin;
