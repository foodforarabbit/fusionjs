import {Plugin} from '@uber/graphene-plugin';
import Genghis from '@uber/node-genghis';

export default ({Logger, Client = Genghis, ...config}) => {
  const logger = Logger.of();
  const client = new Client({logger, ...config});
  client.load();
  client.setLoadInterval();
  class RosettaPlugin extends Plugin {
    static of() {
      return super.of();
    }
    constructor() {
      super();
      this.client = client;
    }
    cleanup() {
      this.client.clearInterval();
    }
  }
  return RosettaPlugin;
};
