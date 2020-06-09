// @noflow
import sanitizeRouteForM3 from '../utils/sanitize-route-for-m3';
import AccessLog from '../utils/access-log.js';
import {M3_ROUTE_METRICS_VERSION as version} from '../utils/constants';

export default function routeTiming({events, m3, logger}) {
  // increment handlers
  const incrementHandler = key => ({title, status}) => {
    m3.increment(key, {
      route: status === 404 ? 'not-found' : sanitizeRouteForM3(title),
      status,
      version,
    });
  };

  // timing handlers
  const timingHandler = key => ({title, timing, status}) => {
    m3.timing(key, timing, {
      route: status === 404 ? 'not-found' : sanitizeRouteForM3(title),
      status,
      version,
    });
  };

  const logHandler = type => ({title, timing, status}, ctx) => {
    const accessLog = AccessLog(ctx ? events.from(ctx) : events);
    const meta = {
      type,
      url: ctx && ctx.url,
      route: title,
      timing,
      status,
    };
    accessLog(meta);
  };

  // use route_time here to be consistent
  events.on('pageview:server', timingHandler('route_time'));
  events.on('pageview:server', incrementHandler('pageview_server'));
  events.on('pageview:server', logHandler('pageview:server'));
  events.on('pageview:browser', logHandler('pageview:browser'));
  events.on('pageview:browser', incrementHandler('pageview_browser'));
  events.on('render:server', timingHandler('render_server'));
}
