import tape from 'tape-cup';
import Plugin from '../server';

tape('ga plugin on the server', t => {
  t.equal(
    typeof Plugin.middleware,
    'function',
    'exposes a middleware function'
  );
  t.end();
});

tape('ga plugin server middleware with element', t => {
  const middleware = Plugin.middleware();
  t.plan(1);
  const ctx = {
    element: true,
    template: {
      head: {
        push(content) {
          t.equal(typeof content, 'object', 'pushes sanitized html into head');
        },
      },
    },
  };
  middleware(ctx, () => {
    t.end();
  });
});

tape('ga plugin server middleware with no element', t => {
  const middleware = Plugin.middleware();
  const ctx = {
    element: false,
  };
  middleware(ctx, () => {
    t.pass('calls next');
    t.end();
  });
});
