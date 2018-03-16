import tape from 'tape-cup';
import createM3Plugin from '../plugin.js';

tape('universal m3 api', async t => {
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
      t.equal(first, `first-${method}`, `calls ${method} correctly`);
      t.equal(second, `second-${method}`, `calls ${method} correctly`);
    };
  });

  plugin.provides({m3: realM3});

  Object.keys(flags).forEach(flag => {
    t.equal(flags[flag], true, `calls ${flag} when buffer flushed`);
    flags[flag] = false;
    m3[flag](`first-${flag}`, `second-${flag}`);
    t.equal(flags[flag], true, `calls ${flag} after m3 set`);
  });

  flags.increment = false;
  increment('first-increment', 'second-increment');
  t.equal(
    flags.increment,
    true,
    'proxy works even if using a ref to the original fn'
  );

  t.end();
});

tape('universal m3 api calling provides multiple times', t => {
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

  t.doesNotThrow(() => {
    plugin.provides({m3: realM3});
    plugin.provides({m3: realM3});
  });

  t.end();
});

__BROWSER__ &&
  tape('universal m3 browser api', t => {
    const {plugin} = createM3Plugin();
    const realM3 = {
      counter() {},
      increment() {},
      decrement() {},
      timing() {},
      gauge() {},
    };

    t.doesNotThrow(() => {
      plugin.provides({m3: realM3});
      plugin.provides({m3: realM3});
    });

    t.end();
  });
