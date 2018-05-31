import createLoggerPlugin from './plugin.js';

const {logger, plugin} = createLoggerPlugin();

export const Logger = logger;
export default plugin;
