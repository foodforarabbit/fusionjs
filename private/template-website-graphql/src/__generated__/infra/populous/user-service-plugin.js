// @flow

/* istanbul ignore file */
// @generated
import type {Token} from 'fusion-core';
import type {UserService} from './populous.flow.js';
import {createPlugin, createToken} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {LoggerToken} from 'fusion-tokens';
import {createUserService} from './populous.js';

export const UserServiceToken: Token<UserService> = createToken<*>(
  'UserService'
);
export default createPlugin<
  {
    atreyu: typeof AtreyuToken,
    tracer: typeof TracerToken.optional,
    logger: typeof LoggerToken,
  },
  UserService
>({
  deps: {
    atreyu: AtreyuToken,
    tracer: TracerToken.optional,
    logger: LoggerToken,
  },
  provides: ({atreyu, tracer, logger}) => {
    return createUserService(atreyu, tracer, logger, 'populous');
  },
});
