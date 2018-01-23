import {createToken} from 'fusion-tokens';
import ServerClient, {
  DevSecretsToken as DevSecrets,
  SecretsLocationToken as SecretsLocation,
} from './server.js';
import BrowserClient from './browser.js';

export default (__NODE__ ? ServerClient : BrowserClient);
export const DevSecretsToken = __NODE__ && DevSecrets;
export const SecretsLocationToken = __NODE__ && SecretsLocation;
export const SecretsToken = createToken('Secrets');
