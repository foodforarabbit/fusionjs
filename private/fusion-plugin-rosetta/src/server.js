import {SingletonPlugin} from 'fusion-plugin';
import Genghis from '@uber/node-genghis';

export default ({Logger, Client = Genghis, ...config}) => {
  const logger = Logger.of();
  const client = new Client({logger, ...config});
  client.load();
  client.setLoadInterval();
  function Service() {
    return client;
  }
  return new SingletonPlugin({Service});
};
