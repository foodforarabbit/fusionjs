// @noflow
import ServerPlugin from './server.js';

export {PageSkeletonConfigToken} from './tokens.js';

type PluginType = typeof ServerPlugin;
export default ((__NODE__ && ServerPlugin: any): PluginType);
