// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import browserPerformance from '../handlers/browser-performance';

const browserPerformanceEventFixture = {
  calculatedStats: {
    time_to_first_byte: 53,
    resources_avg_load_time: {
      js: 188,
    },
  },
  resourceEntries: [
    {
      name: 'http://localhost:3000/_static/client-vendor.js',
      initiatorType: 'link',
      duration: 123.4,
    },
  ],
};

const expectedEvents = {
  heatpipe: [
    {
      topicInfo: webTopicInfo,
      message: {
        type: 'stat',
        name: 'time_to_first_byte',
        value_number:
          browserPerformanceEventFixture.calculatedStats['time_to_first_byte'],
      },
    },
    {
      topicInfo: webTopicInfo,
      message: {
        type: 'stat',
        name: 'resources_avg_load_time',
        value_number:
          browserPerformanceEventFixture.calculatedStats.resources_avg_load_time
            .js,
        value: 'js',
      },
    },
    {
      topicInfo: webTopicInfo,
      message: {
        type: 'stat',
        name: 'resource_load_time',
        value_number: Math.round(
          browserPerformanceEventFixture.resourceEntries[0].duration
        ),
        value: browserPerformanceEventFixture.resourceEntries[0].name,
        subvalue:
          browserPerformanceEventFixture.resourceEntries[0].initiatorType,
      },
    },
  ],
  m3: [
    {
      key: 'time_to_first_byte',
      value:
        browserPerformanceEventFixture.calculatedStats['time_to_first_byte'],
    },
  ],
};

tape('browser-performance handler', t => {
  t.plan(4);

  const events = new EventEmitter();

  let _heatpipeEventsCount = 0;
  let _m3EventsCount = 0;

  const mockM3 = {
    timing(key, value) {
      const currentExpected = expectedEvents.m3[_m3EventsCount++];
      t.deepEqual(
        {key, value},
        currentExpected,
        `M3 stat emitted - ${currentExpected.key}`
      );
    },
  };

  const mockHeatpipe = {
    publish(topicInfo, message) {
      const currentExpected = expectedEvents.heatpipe[_heatpipeEventsCount++];
      t.deepEqual(
        {topicInfo, message},
        currentExpected,
        `Heatpipe event published - ${currentExpected.message.name}`
      );
    },
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    events,
    serviceName: 'test',
  });

  browserPerformance({events, m3: mockM3, heatpipeEmitter});

  events.emit(
    'browser-performance-emitter:stats',
    browserPerformanceEventFixture
  );

  t.end();
});
