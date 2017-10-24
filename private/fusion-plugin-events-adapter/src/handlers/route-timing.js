import M3 from '../emitters/m3';
export default function routeTiming(events) {
  const m3 = M3(events);
  const addHandler = handler => type => {
    events.on(type, handler(type));
  };

  // increment handlers
  const incrementHandler = key => ({title}) => {
    m3.increment({
      key,
      tags: {route: title},
    });
  };
  const addIncrementHandler = addHandler(incrementHandler);

  // timing handlers
  const timingHandler = key => ({title, timing, status}) => {
    m3.timing({
      key,
      value: timing,
      tags: {route: title, status},
    });
  };
  const addTimingHandler = addHandler(timingHandler);

  // use route_time here to be consistent
  events.on('pageview:server', timingHandler('route_time'));

  addIncrementHandler('pageview:server');
  addIncrementHandler('pageview:browser');
  addTimingHandler('downstream:server');
  addTimingHandler('render:server');
  addTimingHandler('upstream:server');
}
