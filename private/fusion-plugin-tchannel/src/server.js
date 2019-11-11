// @flow
/* eslint-env node */
import fs from 'fs';
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import TChannel from '@uber/tchannel';
import path from 'path';
import {TChannelClientToken} from './tokens.js';

import type {
  TChannelDepsType,
  TChannelType,
  TChannelPluginType,
} from './types.js';

const pluginFactory = () =>
  createPlugin<TChannelDepsType, TChannelType>({
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

      /* eslint-disable import/no-dynamic-require */
      const appVersion: string = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
      ).version;
      /* eslint-enable import/no-dynamic-require */

      const channel = new TChannelClient({
        host: '0.0.0.0',
        port: 5437, // https://infra.uberinternal.com/ports/5437
        // $FlowFixMe this code assumes Logtron, but typeof LoggerToken != typeof Logtron
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
        tchannel: typeof TChannelClient;
        cleanup() {
          return new Promise(resolve => this.tchannel.close(resolve));
        }
      }
      return new TchannelService();
    },
    cleanup: tchannel => tchannel.cleanup(),
  });

export default ((__NODE__ && pluginFactory(): any): TChannelPluginType);
