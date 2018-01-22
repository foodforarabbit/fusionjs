import {createToken} from 'fusion-tokens';
import ServerLogger, {HyperbahnConfigToken as HyperbahnConfig} from './server';
import BrowserLogger from './browser';

export default (__NODE__ ? ServerLogger : BrowserLogger);
export const HyperbahnConfigToken = __NODE__ && HyperbahnConfig;
export const TChannelToken = createToken('TChannelToken');
