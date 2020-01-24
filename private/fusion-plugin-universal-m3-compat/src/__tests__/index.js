// @noflow
import createM3Plugin from '../plugin.js';

test('universal m3 api', async () => {
  const {m3, plugin} = createM3Plugin();
  let flags = {
    counter: false,
    increment: false,
    decrement: false,
    timing: false,
    gauge: false,
  };
  if (__NODE__) {
    flags = Object.assign(flags, {
      close: false,
      immediateCounter: false,
      immediateIncrement: false,
      immediateDecrement: false,
      immediateTiming: false,
      immediateGauge: false,
    });
  }

  const increment = m3.increment.bind(m3);

  Object.keys(flags).forEach(flag => {
    m3[flag](`first-${flag}`, `second-${flag}`);
  });

  const realM3 = {
    scope() {},
  };
  Object.keys(flags).forEach(method => {
    realM3[method] = (first, second) => {
      flags[method] = true;
      expect(first).toBe(`first-${method}`);
      expect(second).toBe(`second-${method}`);
    };
  });

  plugin.provides({m3: realM3});

  Object.keys(flags).forEach(flag => {
    expect(flags[flag]).toBe(true);
    flags[flag] = false;
    m3[flag](`first-${flag}`, `second-${flag}`);
    expect(flags[flag]).toBe(true);
  });

  flags.increment = false;
  increment('first-increment', 'second-increment');
  expect(flags.increment).toBe(true);
});

test('universal m3 api calling provides multiple times', () => {
  const {plugin} = createM3Plugin();
  const realM3 = {
    scope() {},
    close() {},
    counter() {},
    increment() {},
    decrement() {},
    timing() {},
    gauge() {},
    immediateCounter() {},
    immediateIncrement() {},
    immediateDecrement() {},
    immediateTiming() {},
    immediateGauge() {},
  };

  expect(() => {
    plugin.provides({m3: realM3});
    plugin.provides({m3: realM3});
  }).not.toThrow();
});

__BROWSER__ &&
  test('universal m3 browser api', () => {
    const {plugin} = createM3Plugin();
    const realM3 = {
      counter() {},
      increment() {},
      decrement() {},
      timing() {},
      gauge() {},
    };

    expect(() => {
      plugin.provides({m3: realM3});
      plugin.provides({m3: realM3});
    }).not.toThrow();
  });
