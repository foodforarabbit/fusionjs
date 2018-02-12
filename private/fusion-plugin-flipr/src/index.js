// @flow
import server from './server';
import browser from './browser';

export {FliprToken, FliprClientToken, FliprConfigToken} from './tokens';

declare var __NODE__: Boolean;
export default (__NODE__ ? server : browser);
