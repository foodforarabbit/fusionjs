// Main export file
import server, {ConfigToken} from './server';
import browser from './browser';

export default (__NODE__ ? server : browser);
export const GalileoConfigToken = __NODE__ && ConfigToken;
