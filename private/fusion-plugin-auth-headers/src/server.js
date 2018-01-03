import assert from 'assert';

import {Plugin} from 'fusion-core';

const authHeaderPrefix = 'x-auth-params-';

class MissingXAuthParamError extends Error {
  constructor(url, param) {
    const message =
      `Unable to resolve the ${authHeaderPrefix}${param} parameter for the ` +
      `incoming request to ${url || 'unknown path'}. ` +
      'Please either provide an override for this parameter or ensure that it is ' +
      'being injected into request headers.';
    super(message);

    this.name = 'MissingXAuthParamError';
  }
}

export default devOverrideConfig => {
  class AuthHeaders {
    constructor(ctx) {
      assert(ctx, `AuthHeaders requires a ctx object: ${ctx}`);
      this.ctx = ctx;
      this.devOverrideConfig = (__DEV__ && devOverrideConfig) || {};
    }

    get(key) {
      let xAuthValue =
        this.devOverrideConfig[key] ||
        this.ctx.request.headers[`${authHeaderPrefix}${key}`];

      if (!xAuthValue) {
        throw new MissingXAuthParamError(this.ctx.request.url, key);
      }
      return xAuthValue;
    }
  }

  return new Plugin({Service: AuthHeaders});
};
