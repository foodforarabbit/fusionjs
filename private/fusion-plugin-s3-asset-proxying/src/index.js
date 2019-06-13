// @flow
import ServerClient from './server.js';
import BrowserClient from './browser.js';

declare var __NODE__: Boolean;
export default __NODE__ ? ServerClient : BrowserClient;
export {S3ConfigToken, AssetProxyingResponseHeaderOverrides} from './tokens.js';
