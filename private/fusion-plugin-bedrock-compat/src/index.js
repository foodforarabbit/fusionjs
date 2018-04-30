import Server, {InitializeServerToken, BedrockCompatToken} from './server.js';
import Browser from './browser.js';
export default (__NODE__ ? Server : Browser);
export {InitializeServerToken, BedrockCompatToken};
