// @flow
import ServerClient from './server.js';
import BrowserClient from './browser.js';

declare var __NODE__: Boolean;
export default __NODE__ ? ServerClient : BrowserClient;
export {SecretsToken, DevSecretsToken, SecretsLocationToken} from './tokens';
