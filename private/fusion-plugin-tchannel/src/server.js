// @flow
/* eslint-env node */
import {createPlugin, createToken} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import TChannel from 'tchannel';
import path from 'path';

export const TChannelClientToken = createToken('TChannelClient');

export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
      TChannelClient: TChannelClientToken.optional,
    },
    provides: deps => {
      const {logger, m3} = deps;
      const TChannelClient = deps.TChannelClient || TChannel;
      const service = process.env.SVC_ID || 'dev-service';
      const dc = process.env.UBER_DATACENTER || 'sjc1';

      // eslint-disable-next-line import/no-dynamic-require
      const appVersion = require(path.join(process.cwd(), 'package.json'))
        .version;

      const channel = new TChannelClient({
        host: '0.0.0.0',
        port: 5437, // https://infra.uberinternal.com/ports/5437
        logger: logger.createChild('tchannel'),
        statsd: m3,
        statTags: {
          app: service,
          cluster: dc,
          version: appVersion,
        },
      });

      class TchannelService {
        constructor() {
          this.tchannel = channel;
        }
        cleanup() {
          return new Promise(resolve => this.tchannel.close(resolve));
        }
      }
      return new TchannelService();
    },
    cleanup: tchannel => tchannel.cleanup(),
  });
