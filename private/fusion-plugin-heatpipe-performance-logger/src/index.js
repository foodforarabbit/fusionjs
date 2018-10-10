// @flow
import server, {HeatpipePerfLoggerConfig} from './server';
import browser from './browser';

export {HeatpipePerfLoggerConfig};
export default (__NODE__ ? server : browser);
