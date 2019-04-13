// @noflow
import createXhrPlugin from './plugin.js';

const {xhr, plugin} = createXhrPlugin();

export function UberXhr() {
  return xhr;
}
export default plugin;
