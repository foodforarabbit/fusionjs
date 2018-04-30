import {createPlugin, createToken} from 'fusion-core';
import bedrock from '@uber/bedrock-14-compat';
import {LoggerToken} from 'fusion-tokens';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {M3Token} from '@uber/fusion-plugin-m3';
import {GalileoToken} from '@uber/fusion-plugin-galileo';

export const InitializeServerToken = createToken('InitializeServer');

export default __NODE__ &&
  createPlugin({
    deps: {
      initServer: InitializeServerToken,
      logger: LoggerToken,
      atreyu: AtreyuToken,
      m3: M3Token,
      galileo: GalileoToken,
    },
    provides: deps => {
      const server = bedrock.createServer();
      server.clients = {
        logger: deps.logger,
        atreyu: deps.atreyu,
        m3: deps.m3,
        galileo: deps.galileo.galileo,
      };
      return deps.initServer(server, () => {});
    },
  });
