import ServerClient from './server.js';
import BrowserClient from './browser.js';

export default (__NODE__ ? ServerClient : BrowserClient);
