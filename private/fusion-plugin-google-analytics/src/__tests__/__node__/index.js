import tape from 'tape-cup';
import Plugin from '../../server';

tape('ga plugin on the server', t => {
  const PluginClass = Plugin();
  t.ok(PluginClass, 'does not throw at setup time');
  t.equal(typeof PluginClass.of, 'function', 'exposes a of function');
  t.throws(() => PluginClass.of(), 'throws at instantiation time');
  t.throws(
    () => new PluginClass(),
    /Google analytics cannot be used on the server/,
    'throws when using constructor'
  );

  t.equal(
    typeof PluginClass.middleware,
    'function',
    'exposes a middleware function'
  );
  t.end();
});

tape('ga plugin server middleware with element', t => {
  const ga = Plugin();
  t.plan(1);
  const ctx = {
    element: true,
    body: {
      head: {
        push(content) {
          t.equal(typeof content, 'object', 'pushes sanitized html into head');
        },
      },
    },
  };
  ga.middleware(ctx, () => {
    t.end();
  });
});

tape('ga plugin server middleware with no element', t => {
  const ga = Plugin();
  const ctx = {
    element: false,
  };
  ga.middleware(ctx, () => {
    t.pass('calls next');
    t.end();
  });
});
