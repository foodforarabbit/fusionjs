// @flow
import server, {ConfigToken} from './server';
import browser from './browser';

declare var __NODE__: Boolean;
export default (__NODE__ ? server : browser);
export const RosettaConfigToken = __NODE__ && ConfigToken;
