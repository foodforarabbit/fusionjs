export default function routeTiming({events, m3}) {
  // invalid character list from: https://engdocs.uberinternal.com/m3_and_umonitor/send_metrics/requirements.html
  const INVALID_M3_CHARACTERS_REG_EX = /[+,=:|\s()]/g;
  const sanitizeRoute = route =>
    route.replace(INVALID_M3_CHARACTERS_REG_EX, '__');

  // increment handlers
  const incrementHandler = key => ({title, status}) => {
    m3.increment(key, {
      route: status === 404 ? 'not-found' : sanitizeRoute(title),
      status,
    });
  };

  // timing handlers
  const timingHandler = key => ({title, timing, status}) => {
    m3.timing(key, timing, {
      route: status === 404 ? 'not-found' : sanitizeRoute(title),
      status,
    });
  };

  // use route_time here to be consistent
  events.on('pageview:server', timingHandler('route_time'));
  events.on('pageview:server', incrementHandler('pageview_server'));
  events.on('pageview:browser', incrementHandler('pageview_browser'));
  events.on('render:server', timingHandler('render_server'));
}
