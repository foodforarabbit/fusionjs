// @flow
import EventEmitter from './custom-event-emitter.js';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import reactAction from '../handlers/redux-action';

test('redux-action handler', () => {
  const events = new EventEmitter();

  const mockM3 = {
    increment(key, tags) {
      expect(key).toBe('action');
      expect(tags).toStrictEqual({action_type: 'foo'});
    },
  };

  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect({topicInfo, message}).toEqual({
        topicInfo: webTopicInfo,
        message: {
          app_name: 'test',
          app_runtime: 'development',
          type: 'action',
          name: 'foo',
          meta: {s: 'str'},
          meta_bool: {b: false},
          meta_long: {i: 53},
        },
      });
      return Promise.resolve();
    },
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    serviceName: 'test',
    runtime: 'development',
  });

  reactAction({events, heatpipeEmitter, m3: mockM3});

  events.emit('redux-action-emitter:action', {
    type: 'foo',
    _trackingMeta: {s: 'str', b: false, i: 53},
  });
});

test('redux-action handler - action is not a plain-object', done => {
  const events = new EventEmitter();

  const mockM3 = {
    increment() {
      // $FlowFixMe
      done.fail('should not emit non-plain-object actions');
    },
  };

  const mockHeatpipe = {
    asyncPublish() {
      // $FlowFixMe
      done.fail('should not emit non-plain-object actions');
    },
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    service: 'test',
  });

  reactAction({events, heatpipeEmitter, m3: mockM3});

  events.emit('redux-action-emitter:action', dispatch => {
    dispatch({type: 'foo'});
  });
  done();
});

test('redux-action handler - nested _trackingMeta', () => {
  const events = new EventEmitter();

  const mockM3 = {
    increment(key, tags) {
      expect(key).toBe('action');
      expect(tags).toStrictEqual({action_type: 'foo'});
    },
  };

  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect({topicInfo, message}).toEqual({
        topicInfo: webTopicInfo,
        message: {
          app_name: 'test',
          app_runtime: 'development',
          type: 'action',
          name: 'foo',
          meta: {s: 'str'},
          meta_bool: {b: false},
          meta_long: {i: 53},
        },
      });
      return Promise.resolve();
    },
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    serviceName: 'test',
    runtime: 'development',
  });

  reactAction({events, heatpipeEmitter, m3: mockM3});

  events.emit('redux-action-emitter:action', {
    type: 'foo',
    payload: {
      _trackingMeta: {s: 'str', b: false, i: 53},
    },
  });
});
