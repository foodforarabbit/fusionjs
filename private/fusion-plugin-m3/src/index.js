/* eslint-env browser */
import server from './server';
import browser from './browser';

export {default as mock} from './mock';

export default (__NODE__ ? server : browser);
