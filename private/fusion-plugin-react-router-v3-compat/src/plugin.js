import ServerPlugin from './server';
import BrowserPlugin from './browser';

export default (__NODE__ ? ServerPlugin : BrowserPlugin);
