import Server from './server.js';
import Browser from './browser.js';
export default (__NODE__ ? Server : Browser);
