export default function routeTiming({events, m3}) {
  // increment handlers
  const incrementHandler = key => ({title}) => {
    m3.increment({
      key,
      tags: {route: title},
    });
  };

  // timing handlers
  const timingHandler = key => ({title, timing, status}) => {
    m3.timing({
      key,
      value: timing,
      tags: {route: title, status},
    });
  };

  // use route_time here to be consistent
  events.on('pageview:server', timingHandler('route_time'));
  events.on('pageview:server', incrementHandler('pageview_server'));
  events.on('pageview:browser', incrementHandler('pageview_browser'));
  events.on('render:server', timingHandler('render_server'));
}
