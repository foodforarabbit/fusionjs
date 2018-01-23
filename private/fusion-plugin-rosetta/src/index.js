import server, {ConfigToken} from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);
export const RosettaConfigToken = __NODE__ && ConfigToken;
