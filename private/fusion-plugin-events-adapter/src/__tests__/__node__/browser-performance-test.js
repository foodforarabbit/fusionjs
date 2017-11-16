// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import Heatpipe, {webTopicInfo} from '../../emitters/heatpipe';
import M3 from '../../emitters/m3';

import browserPerformance from '../../handlers/browser-performance';

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
  const m3 = M3(events);
  const heatpipe = Heatpipe({events, service: 'test'});

  browserPerformance({events, m3, heatpipe});

  let _heatpipeEventsCount = 0;
  let _m3EventsCount = 0;

  events.on('heatpipe:publish', payload => {
    const currentExpected = expectedEvents.heatpipe[_heatpipeEventsCount++];
    t.deepEqual(
      payload,
      currentExpected,
      `Heatpipe event published - ${currentExpected.message.name}`
    );
  });

  events.on('m3:timing', payload => {
    const currentExpected = expectedEvents.m3[_m3EventsCount++];
    t.deepEqual(
      payload,
      currentExpected,
      `M3 stat emitted - ${currentExpected.key}`
    );
  });

  events.emit(
    'browser-performance-emitter:stats',
    browserPerformanceEventFixture
  );

  t.end();
});
