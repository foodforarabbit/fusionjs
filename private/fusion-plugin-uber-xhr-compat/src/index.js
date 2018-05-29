import createXhrPlugin from './plugin.js';

const {xhr, plugin} = createXhrPlugin();

export const UberXhr = () => xhr;
export default plugin;
