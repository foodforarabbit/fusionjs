// @flow
import tape from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import mock from '../mock';
import {M3Token} from '../index';

tape('mock with ensure methods are called', async t => {
  const methods = [
    'scope',
    'close',
    'increment',
    'decrement',
    'counter',
    'timing',
    'gauge',
    'immediateIncrement',
    'immediateDecrement',
    'immediateCounter',
    'immediateTiming',
    'immediateGauge',
  ];
  const app = new App('el', el => el);
  // $FlowFixMe
  app.register(M3Token, mock);
  app.middleware({m3: M3Token}, ({m3}) => {
    methods.forEach(m => {
      if (m === 'scope' || m === 'close') {
        m3[m]('arg1');
        // $FlowFixMe
        const called = m3.getCalls().pop();
        t.equal(called[0], m);
        t.deepLooseEqual(called[1], ['arg1']);
      } else if (
        m === 'increment' ||
        m === 'decrement' ||
        m === 'immediateDecrement' ||
        m === 'immediateIncrement'
      ) {
        m3[m]('arg1', {tags: 'tags'});
        // $FlowFixMe
        const called = m3.getCalls().pop();
        t.equal(called[0], m);
        t.deepLooseEqual(called[1], ['arg1', {tags: 'tags'}]);
      } else {
        m3[m]('arg1', 100);
        // $FlowFixMe
        const called = m3.getCalls().pop();
        t.equal(called[0], m);
        t.deepLooseEqual(called[1], ['arg1', 100]);
      }
    });
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});
