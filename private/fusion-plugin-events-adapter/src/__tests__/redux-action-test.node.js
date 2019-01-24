// @flow
import EventEmitter from './custom-event-emitter.js';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import reactAction from '../handlers/redux-action';

tape('redux-action handler', t => {
  const events = new EventEmitter();

  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'action');
      t.deepLooseEqual(tags, {action_type: 'foo'});
      t.pass('m3 incremented');
    },
  };

  const mockHeatpipe = {
    publish(topicInfo, message) {
      t.deepEqual(
        {topicInfo, message},
        {
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
        },
        `Heatpipe event published`
      );
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

  t.end();
});

tape('redux-action handler - action is not a plain-object', t => {
  const events = new EventEmitter();

  const mockM3 = {
    increment() {
      t.fail('should not emit non-plain-object actions');
    },
  };

  const mockHeatpipe = {
    publish() {
      t.fail('should not emit non-plain-object actions');
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

  t.pass('Do not emit non-plain-object actions');

  t.end();
});

tape('redux-action handler - nested _trackingMeta', t => {
  const events = new EventEmitter();

  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'action');
      t.deepLooseEqual(tags, {action_type: 'foo'});
      t.pass('m3 incremented');
    },
  };

  const mockHeatpipe = {
    publish(topicInfo, message) {
      t.deepEqual(
        {topicInfo, message},
        {
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
        },
        `Heatpipe event published`
      );
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

  t.end();
});
