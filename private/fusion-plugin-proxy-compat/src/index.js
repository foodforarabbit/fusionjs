import plugin from './plugin.js';
import decider from './decider.js';

export default __NODE__ && plugin;
export const ProxySSRDecider = __NODE__ && decider;
