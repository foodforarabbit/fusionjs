// @noflow
import sanitizeRouteForM3 from '../utils/sanitize-route-for-m3';

export default function routeTiming({events, m3}) {
  // increment handlers
  const incrementHandler = key => ({title, status}) => {
    m3.increment(key, {
      route: status === 404 ? 'not-found' : sanitizeRouteForM3(title),
      status,
    });
  };

  // timing handlers
  const timingHandler = key => ({title, timing, status}) => {
    m3.timing(key, timing, {
      route: status === 404 ? 'not-found' : sanitizeRouteForM3(title),
      status,
    });
  };

  // use route_time here to be consistent
  events.on('pageview:server', timingHandler('route_time'));
  events.on('pageview:server', incrementHandler('pageview_server'));
  events.on('pageview:browser', incrementHandler('pageview_browser'));
  events.on('render:server', timingHandler('render_server'));
}
