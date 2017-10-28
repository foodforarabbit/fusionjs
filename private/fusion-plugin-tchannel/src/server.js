/* eslint-env node */
import {SingletonPlugin} from '@uber/graphene-plugin';
import TChannel from 'tchannel';
import Hyperbahn from 'tchannel/hyperbahn';
import path from 'path';
import fs from 'fs';
import myLocalIp from 'my-local-ip';

export default (
  {
    appName,
    Logger,
    M3,
    config,
    TChannelClient = TChannel,
    HyperbahnClient = Hyperbahn,
  } = {}
) => {
  const dc = process.env.UBER_DATACENTER || 'sjc';
  const appVersion = require(path.join(process.cwd(), 'package.json')).version;
  const logger = Logger.of();
  const m3 = M3.of();
  const channel = new TChannelClient({
    logger: logger.createChild('tchannel'),
    statsd: m3,
    statTags: {
      app: appName,
      cluster: dc,
      version: appVersion,
    },
  });

  const hbConfig = Object.assign(
    {
      logger: logger,
      tchannel: channel,
      serviceName: appName,
      isHealthy: defaultHealthCheck,
      statsd: m3,
      hardFail: true,
    },
    config.hyperbahn
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

  // we can't continue without any ports defined
  if (!hbConfig.hostPortList) {
    logger.error('Hyperbahn instantiated without ports definition', hbConfig);
    throw new Error('Hyperbahn instantiated without ports definition');
  }

  var hyperbahn = new HyperbahnClient(hbConfig);
  var cHost = myLocalIp() || '127.0.0.1';
  channel.listen(0, cHost, advertiseHyperbahn);

  function advertiseHyperbahn() {
    var shouldAdvertise = config.hyperbahn && config.hyperbahn.advertise;
    if (channel.listening) {
      // explicitly checking false because the default is to advertise
      if (shouldAdvertise === false) {
        logger.info('Hyperbahn advertising disabled');
      } else {
        hyperbahn.advertise();
      }
    } else {
      // This race condition happens sometimes while testing because uic is
      // syncronously created.
      logger.warn('TChannel/Hyperbahn race condition hit');
    }
  }

  function defaultHealthCheck() {
    return {ok: true, message: appName + ' is healthy\n'};
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
  return new SingletonPlugin({Service: TchannelService});
};
