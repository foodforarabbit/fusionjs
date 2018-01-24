import server from './server';
import browser from './browser';

export {FliprToken, FliprClientToken, FliprConfigToken} from './tokens';

export default (__NODE__ ? server : browser);
