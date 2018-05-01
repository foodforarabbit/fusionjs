import RPC from '@uber/bedrock/web-rpc';
import M3 from '@uber/bedrock/universal-m3';
import Logger from '@uber/bedrock/universal-logger';
import WebRpcAtreyu from '@uber/web-rpc-atreyu';
import getAuthParams from '@uber/get-auth-params';
import {rpcIds} from '../shared/rpc-constants';
import atreyuGraphs from './atreyu/graphs';
import atreyuSeeds from './atreyu/seeds';
import atreyuTransforms from './atreyu/transforms';

export default function(server) {
  const webRpcAtreyu = new WebRpcAtreyu(
    server.clients.atreyu,
    server.config.webRpcAtreyu
  );

  const methods = {
    [rpcIds.getUser]: webRpcAtreyu({
      graphDef: atreyuGraphs.user,
      seed: atreyuSeeds.user,
      transform: atreyuTransforms.user,
    }),
  };

  return RPC.init(methods, M3, Logger.createChild('web-rpc'));
}
