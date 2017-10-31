/* eslint-env browser */
// TODO: [Nice to have] Make specified Flipr properties in config.clientProperties available on client
import {SingletonPlugin} from 'fusion-plugin';
export default function() {
  return new SingletonPlugin({
    Service: function() {
      throw new Error('Cannot instantiate FliprPlugin in the browser');
    },
  });
}
