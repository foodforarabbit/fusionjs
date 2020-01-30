// @flow
import EventEmitter from './custom-event-emitter.js';

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

const expectedHeatpipeEvents = [
  {
    topicInfo: webTopicInfo,
    message: {
      app_name: 'test',
      app_runtime: 'development',
      type: 'stat',
      name: 'time_to_first_byte',
      value_number:
        browserPerformanceEventFixture.calculatedStats.time_to_first_byte,
    },
  },
  {
    topicInfo: webTopicInfo,
    message: {
      app_name: 'test',
      app_runtime: 'development',
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
      app_name: 'test',
      app_runtime: 'development',
      type: 'stat',
      name: 'resource_load_time',
      value_number: Math.round(
        browserPerformanceEventFixture.resourceEntries[0].duration
      ),
      value: browserPerformanceEventFixture.resourceEntries[0].name,
      subvalue: browserPerformanceEventFixture.resourceEntries[0].initiatorType,
    },
  },
];

function createMockM3(expectedEvents) {
  let _m3EventsCount = 0;

  return {
    timing(key, value, tags) {
      const currentExpected = expectedEvents.m3[_m3EventsCount++];
      expect({key, value, tags}).toEqual(currentExpected);
    },
  };
}

function createMockHeatpipe(expectedEvents) {
  let _heatpipeEventsCount = 0;

  return {
    asyncPublish(topicInfo, message) {
      const currentExpected = expectedEvents.heatpipe[_heatpipeEventsCount++];
      expect({topicInfo, message}).toEqual(currentExpected);
      return Promise.resolve();
    },
  };
}

test('browser-performance handler', () => {
  expect.assertions(4);

  const expectedEvents = {
    heatpipe: expectedHeatpipeEvents,
    m3: [
      {
        key: 'time_to_first_byte',
        value:
          browserPerformanceEventFixture.calculatedStats.time_to_first_byte,
        tags: {},
      },
    ],
  };

  const events = new EventEmitter();

  const mockM3 = createMockM3(expectedEvents);
  const mockHeatpipe = createMockHeatpipe(expectedEvents);

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    events,
    serviceName: 'test',
    runtime: 'development',
  });

  browserPerformance({events, m3: mockM3, heatpipeEmitter});

  events.emit(
    'browser-performance-emitter:stats',
    browserPerformanceEventFixture
  );
});

test('browser-performance handler with __url__', () => {
  expect.assertions(4);

  const expectedEventsWithUrl = {
    heatpipe: expectedHeatpipeEvents,
    m3: [
      {
        key: 'time_to_first_byte',
        value:
          browserPerformanceEventFixture.calculatedStats.time_to_first_byte,
        tags: {route: '/view/__itemUuid'},
      },
    ],
  };

  const events = new EventEmitter();

  const mockM3 = createMockM3(expectedEventsWithUrl);
  const mockHeatpipe = createMockHeatpipe(expectedEventsWithUrl);

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    events,
    serviceName: 'test',
    runtime: 'development',
  });

  browserPerformance({events, m3: mockM3, heatpipeEmitter});

  events.emit('browser-performance-emitter:stats', {
    ...browserPerformanceEventFixture,
    __url__: '/view/:itemUuid',
  });
});
