// @flow
import tape from 'tape-cup';
import Plugin from '../server';

tape(
  'ga plugin on the server',
  (t): void => {
    t.equal(
      typeof Plugin.middleware,
      'function',
      'exposes a middleware function'
    );
    t.end();
  }
);

tape(
  'ga plugin server middleware with element',
  (t): void => {
    // $FlowFixMe
    const middleware = Plugin.middleware();
    t.plan(1);
    const ctx = {
      element: true,
      template: {
        head: {
          push(content): void {
            t.equal(
              typeof content,
              'object',
              'pushes sanitized html into head'
            );
          },
        },
      },
    };
    middleware(
      // $FlowFixMe
      ctx,
      // $FlowFixMe
      (): void => {
        t.end();
      }
    );
  }
);

tape(
  'ga plugin server middleware with no element',
  (t): void => {
    // $FlowFixMe
    const middleware = Plugin.middleware();
    const ctx = {element: false};
    middleware(
      // $FlowFixMe
      ctx,
      // $FlowFixMe
      (): void => {
        t.pass('calls next');
        t.end();
      }
    );
  }
);
