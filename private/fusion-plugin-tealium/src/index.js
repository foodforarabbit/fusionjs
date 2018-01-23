/* eslint-env browser */
import server from './server';
import browser from './browser';

export {TealiumToken, TealiumConfigToken} from './tokens';

export default (__NODE__ ? server : browser);
