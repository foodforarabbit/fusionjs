/* eslint-env browser */
import server from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);
export {HeatpipeToken, HeatpipeConfigToken} from './tokens';
