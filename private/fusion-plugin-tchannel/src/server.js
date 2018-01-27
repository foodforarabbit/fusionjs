/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {LoggerToken, createOptionalToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

import TChannel from 'tchannel';
import Hyperbahn from 'tchannel/hyperbahn';
import path from 'path';
import fs from 'fs';
import myLocalIp from 'my-local-ip';

export const HyperbahnConfigToken = createOptionalToken('HyperbahnConfig', {});
export const TChannelClientToken = createOptionalToken(
  'TChannelClient',
  TChannel
);
export const HyperbahnClientToken = createOptionalToken(
  'HyperbahnClient',
  Hyperbahn
);

export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
      hyperbahnConfig: HyperbahnConfigToken,
      TChannelClient: TChannelClientToken,
      HyperbahnClient: HyperbahnClientToken,
    },
    provides: deps => {
      const {
        logger,
        m3,
        hyperbahnConfig,
        TChannelClient,
        HyperbahnClient,
      } = deps;
      const dc = process.env.UBER_DATACENTER || 'sjc';
      const service = process.env.SVC_ID || 'dev-service';
      // eslint-disable-next-line import/no-dynamic-require
      const appVersion = require(path.join(process.cwd(), 'package.json'))
        .version;
      const channel = new TChannelClient({
        logger: logger.createChild('tchannel'),
        statsd: m3,
        statTags: {
          app: service,
          cluster: dc,
          version: appVersion,
        },
      });

      const hbConfig = Object.assign(
        {
          logger: logger,
          tchannel: channel,
          serviceName: service,
          isHealthy: defaultHealthCheck,
          statsd: m3,
          hardFail: true,
          advertise: true,
        },
        hyperbahnConfig
      );

      // reading ports from config defined hosts.json
      if (!hbConfig.hostPortList && hbConfig.hostPortFile) {
        logger.warn('no hostPortList set - reading from hostPortFile');
        hbConfig.hostPortList = readFile(hbConfig.hostPortFile);
      }

      // reading ports from uber default hosts.json location
      if (!hbConfig.hostPortList) {
        logger.warn('no hostPortList set - trying Uber default location');
        hbConfig.hostPortList = readFile('/etc/uber/hyperbahn/hosts.json');
      }

      if (__DEV__ && !hbConfig.hostPortFile) {
        logger.warn('no hostPortList set - using development defaults');
        hbConfig.hostPortList = ['127.0.0.1:21300', '127.0.0.1:21301'];
      }

      // we can't continue without any ports defined
      if (!hbConfig.hostPortList) {
        logger.error(
          'Hyperbahn instantiated without ports definition',
          hbConfig
        );
        throw new Error('Hyperbahn instantiated without ports definition');
      }

      var hyperbahn = new HyperbahnClient(hbConfig);
      var cHost = myLocalIp() || '127.0.0.1';
      channel.listen(0, cHost, advertiseHyperbahn);

      function advertiseHyperbahn() {
        var shouldAdvertise = hbConfig.advertise;
        if (channel.listening) {
          if (shouldAdvertise) {
            hyperbahn.advertise();
          } else {
            logger.info('Hyperbahn advertising disabled');
          }
        } else {
          // This race condition happens sometimes while testing because uic is
          // syncronously created.
          logger.warn('TChannel/Hyperbahn race condition hit');
        }
      }

      function defaultHealthCheck() {
        return {ok: true, message: service + ' is healthy\n'};
      }

      function readFile(file) {
        var result;
        try {
          result = JSON.parse(fs.readFileSync(file, 'utf-8'));
        } catch (err) {
          logger.warn('unable to read ' + file);
        }
        return result;
      }
      class TchannelService {
        constructor() {
          this.tchannel = channel;
          this.hyperbahn = hyperbahn;
        }
        cleanup() {
          this.tchannel.close();
          this.hyperbahn.destroy();
        }
      }
      return new TchannelService();
    },
  });
