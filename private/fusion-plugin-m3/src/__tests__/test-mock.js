import tape from 'tape-cup';
import mock from '../mock';

tape('mock with ensure methods are called', async t => {
  let called = {
    scope: false,
    close: false,
    increment: false,
    decrement: false,
    counter: false,
    timing: false,
    gauge: false,
    immediateIncrement: false,
    immediateDecrement: false,
    immediateCounter: false,
    immediateTiming: false,
    immediateGauge: false,
  };
  const callbackFunc = name => {
    called[name] = true;
  };
  const m3 = mock({callbackFunc}).of();

  m3.scope();
  t.equal(called.scope, true, 'scope was called correctly.');

  m3.close();
  t.equal(called.close, true, 'close was called correctly.');

  m3.increment();
  t.equal(called.increment, true, 'increment was called correctly.');

  m3.decrement();
  t.equal(called.decrement, true, 'decrement was called correctly.');

  m3.counter();
  t.equal(called.counter, true, 'counter was called correctly.');

  m3.timing();
  t.equal(called.timing, true, 'timing was called correctly.');

  m3.gauge();
  t.equal(called.gauge, true, 'gauge was called correctly.');

  m3.immediateIncrement();
  t.equal(
    called.immediateIncrement,
    true,
    'immediateIncrement was called correctly.'
  );

  m3.immediateDecrement();
  t.equal(
    called.immediateDecrement,
    true,
    'immediateDecrement was called correctly.'
  );

  m3.immediateCounter();
  t.equal(
    called.immediateCounter,
    true,
    'immediateCounter was called correctly.'
  );

  m3.immediateTiming();
  t.equal(
    called.immediateTiming,
    true,
    'immediateTiming was called correctly.'
  );

  m3.immediateGauge();
  t.equal(called.immediateGauge, true, 'immediateGauge was called correctly.');

  t.end();
});

tape('mock with ensure args are passed through', async t => {
  let wasCalled = false;
  const arg0 = 'does toast need butter?';
  const arg1 = 'indubitably!';
  const callbackFunc = (name, ...args) => {
    wasCalled = true;
    t.equal(name, 'scope', 'method name, scope, was passed correctly.');
    t.equal(args[0], arg0, 'first argument matches.');
    t.equal(args[1], arg1, 'second argument matches.');
  };
  const m3 = mock({callbackFunc}).of();

  m3.scope(arg0, arg1);
  t.true(wasCalled, 'scope was called correctly.');

  t.end();
});
