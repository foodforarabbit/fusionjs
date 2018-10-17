// @noflow
// invalid character list from: https://engdocs.uberinternal.com/m3_and_umonitor/send_metrics/requirements.html
const INVALID_M3_CHARACTERS_REG_EX = /[+,=:|\s()]/g;

const sanitizeRouteForM3 = (route = '') => {
  if (route.startsWith('/_static')) {
    return 'static_asset';
  }
  return route.replace(INVALID_M3_CHARACTERS_REG_EX, '__');
};

export default sanitizeRouteForM3;
