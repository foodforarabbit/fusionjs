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
  app.register(M3Token, mock);
  app.middleware({m3: M3Token}, ({m3}) => {
    methods.forEach(m => {
      m3[m]('arg1', 'arg2');
      const called = m3.getCalls().pop();
      t.equal(called[0], m);
      t.deepLooseEqual(called[1], ['arg1', 'arg2']);
    });
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});
