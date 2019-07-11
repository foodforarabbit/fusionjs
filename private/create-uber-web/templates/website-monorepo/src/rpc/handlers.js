// @flow
// See http://t.uber.com/web-fetching-data
import {createPlugin} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

type RPCHandlersDeps = {
  atreyu: typeof AtreyuToken,
  logger: typeof LoggerToken,
  m3: typeof M3Token,
};
type RPCHandlers = {};

export default createPlugin<RPCHandlersDeps, RPCHandlers>({
  deps: {atreyu: AtreyuToken, logger: LoggerToken, m3: M3Token},
  provides: (/*deps*/) => {
    // implement rpc handlers here
    return {};
  },
});
