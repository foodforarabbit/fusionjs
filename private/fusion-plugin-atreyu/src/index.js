import ServerAtreyu from './server';
import BrowserAtreyu from './browser';

export default (__NODE__ ? ServerAtreyu : BrowserAtreyu);
export {AtreyuToken, AtreyuConfigToken, AtreyuOptionsToken} from './tokens';
