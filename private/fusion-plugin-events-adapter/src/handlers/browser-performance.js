// @noflow
import postToCatalyst from '../utils/post-to-catalyst';
import sanitizeRouteForM3 from '../utils/sanitize-route-for-m3';

const STAT_EVENT = 'stat';

export default function browserPerformance({events, m3, heatpipeEmitter}) {
  events.on('browser-performance-emitter:stats', (payload, ctx) => {
    const {
      webEventsMeta,
      calculatedStats,
      resourceEntries,
      enhancedMetrics,
      __url__,
    } = payload;

    // post enhanced stats to heatpipe
    enhancedMetrics && postToCatalyst({enhancedMetrics, __url__}, ctx);

    if (!isEmpty(calculatedStats)) {
      Object.keys(calculatedStats).forEach(key => {
        const statValue = calculatedStats[key];
        if (typeof statValue === 'number') {
          heatpipeEmitter.publishWebEvents({
            message: {
              type: STAT_EVENT,
              name: key,
              value_number: Math.round(calculatedStats[key]),
            },
            ctx,
            webEventsMeta,
          });

          m3.timing(
            key,
            statValue,
            __url__ ? {route: sanitizeRouteForM3(__url__)} : {}
          );
        }
      });
    }

    const resourceLoadTimes = calculatedStats.resources_avg_load_time;
    if (resourceLoadTimes) {
      Object.keys(resourceLoadTimes).forEach(resourceType => {
        heatpipeEmitter.publishWebEvents({
          message: {
            type: STAT_EVENT,
            name: 'resources_avg_load_time',
            value_number: Math.round(resourceLoadTimes[resourceType]),
            value: resourceType,
          },
          ctx,
          webEventsMeta,
        });
      });
    }

    if (!isEmpty(resourceEntries)) {
      resourceEntries.forEach(entry => {
        heatpipeEmitter.publishWebEvents({
          message: {
            type: STAT_EVENT,
            name: 'resource_load_time',
            value_number: Math.round(entry.duration),
            value: entry.name,
            subvalue: entry.initiatorType,
          },
          ctx,
          webEventsMeta,
        });
      });
    }
  });
}

function isEmpty(item) {
  // eslint-disable-next-line no-undefined
  if (item === null || item === undefined) {
    return true;
  }
  if (typeof item === 'object' && Object.keys(item).length === 0) {
    return true;
  }
  if (Array.isArray(item) && item.length === 0) {
    return true;
  }
  return false;
}
